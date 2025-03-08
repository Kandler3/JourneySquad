import {FC, useEffect, useState} from "react";

import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {ContentSection} from "@/components/ContentSection/ContentSection.tsx";
import {TextInput} from "@/components/TextInput/TextInput.tsx";
import {ContentInlineSection} from "@/components/ContentInlineSection/ContentInlineSection.tsx";
import {DateInput} from "@/components/DateInput/DateInput.tsx";
import {TravelPlanTagsSelector} from "@/components/TravelPlanTagsSelector/TravelPlanTagsSelector.tsx";
import {Cell, FileInput} from "@telegram-apps/telegram-ui";
import {fetchTravelPlanTags} from "@/services/travelPlanService.ts";
import {SaveButton} from "@/components/SaveButton/SaveButton.tsx";
import {toDatetimeFormat} from "@/utils/DateFormats.ts";

import "./TravelPlanForm.css"
import {PhotoEditCard} from "@/components/PhotoEditCard/PhotoEditCard.tsx";

type TravelPlanFormProps = {
    travelPlan: TravelPlan
    onSubmit: (
        title: string,
        description: string,
        startDate: Date,
        endDate: Date,
        activeTags: TravelPlanTag[],
        photos: TravelPlanPhoto[],
        participants: User[],
    ) => void
}

export const TravelPlanForm : FC<TravelPlanFormProps> = ({travelPlan, onSubmit}) => {
    const [tags, setTags] = useState<TravelPlanTag[]>([])

    const [title, setTitle] = useState<string>(travelPlan.title ?? "");
    const [description, setDescription] = useState<string>(travelPlan.description ?? "");
    const [startDate, setStartDate] = useState<string>(travelPlan.getStartDateString() ?? "");
    const [endDate, setEndDate] = useState<string>(travelPlan.getEndDateString() ?? "");
    const [activeTags, setActiveTags] = useState<TravelPlanTag[]>(travelPlan.tags);
    const [photos, setPhotos] = useState<TravelPlanPhoto[]>(travelPlan.photos);
    const [participants, setParticipants] = useState<User[]>(travelPlan.participants);

    useEffect(() => {
        const loadTags = async () => {
            const tags = await fetchTravelPlanTags()
            setTags(tags)
        }

        loadTags();
    }, [])

    const tagIsActive = (tag: TravelPlanTag) =>
        activeTags.some(arr_tag => arr_tag.id === tag.id)


    const handleTagClick = (tag: TravelPlanTag) => {
        if (activeTags.includes(tag))
        {
            setActiveTags(activeTags.filter((t) => t.id !== tag.id));
        }
        else
        {
            setActiveTags([...activeTags, tag]);
        }
        console.log(activeTags)
    }

    const handleSaveClick = () => {
        const start = Date.parse(toDatetimeFormat(startDate))
        const end = Date.parse(toDatetimeFormat(endDate))
        if (!title || isNaN(start) || isNaN(end)) {
            console.log(`invalid form ${title} ${startDate} ${endDate}`)
            return
        }

        onSubmit(title, description, new Date(start), new Date(end), activeTags, photos, participants)
    }

    return (
        <div className="travel-plan-form">
            <ContentSection title="Информация">
                <TextInput value={title} onChange={setTitle} placeholder="Название"/>
                <TextInput value={description} onChange={setDescription} multiline={true} placeholder="Описание"/>
            </ContentSection>
            <ContentSection title="Даты">
                <ContentInlineSection title="Прибытие">
                    <DateInput value={startDate} onChange={setStartDate} />
                </ContentInlineSection>
                <ContentInlineSection title="Отъезд">
                    <DateInput value={endDate} onChange={setEndDate} />
                </ContentInlineSection>
            </ContentSection>
            <TravelPlanTagsSelector
                tags={tags}
                title="Теги"
                isActivePredicate={tagIsActive}
                onClick={handleTagClick}
            />
            <ContentSection title="Фотографии">
                {photos.map(
                    photo =>
                        <PhotoEditCard photo={photo} onDeleteClick={photo => {}} key={photo.id}/>
                )}
                <FileInput label="Добавить"/>
            </ContentSection>
            <SaveButton onClick={handleSaveClick}>
                Сохранить
            </SaveButton>
        </div>
    )
}