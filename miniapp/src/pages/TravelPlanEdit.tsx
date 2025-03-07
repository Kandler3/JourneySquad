import {FC, useEffect, useState} from "react";
import {Page} from "@/components/Page.tsx";
import {ContentSection} from "@/components/ContentSection/ContentSection.tsx";
import {Cell, FileInput} from "@telegram-apps/telegram-ui";
import {ContentInlineSection} from "@/components/ContentInlineSection/ContentInlineSection.tsx";
import {DateInput} from "@/components/DateInput/DateInput.tsx";
import {useParams} from "react-router-dom";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {fetchTravelPlan, fetchTravelPlanTags} from "@/services/travelPlanService.ts";
import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanTagsSelector} from "@/components/TravelPlanTagsSelector/TravelPlanTagsSelector.tsx";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {TextInput} from "@/components/TextInput/TextInput.tsx";

export const TravelPlanEditPage : FC = () => {
    const {id} = useParams()
    let travelPlanId : number | undefined
    if (id !== undefined)
        travelPlanId = Number(id)
    else
        travelPlanId = undefined

    const [travelPlan, setTravelPlan] = useState<TravelPlan>(new TravelPlan());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [tags, setTags] = useState<TravelPlanTag[]>([])

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [activeTags, setActiveTags] = useState<TravelPlanTag[]>([]);
    const [photos, setPhotos] = useState<TravelPlanPhoto[]>([]);
    const [participants, setParticipants] = useState<User[]>([]);



    useEffect(() => {
        const loadTravelPlan = async (id : number) => {
            try {
                const plan = await fetchTravelPlan(id);
                if (plan)
                    setTravelPlan(plan);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        if (travelPlanId !== undefined)
        {
            loadTravelPlan(travelPlanId);

            setTitle(travelPlan.title ?? title);
            setDescription(travelPlan.description ?? description);
            setStartDate(travelPlan.getStartDateString() ?? startDate);
            setEndDate(travelPlan.getEndDateString() ?? endDate);
            setActiveTags(travelPlan.tags ?? activeTags);
            setPhotos(travelPlan.photos ?? photos);
            setParticipants(travelPlan.participants ?? participants);
        }
    }, []);

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

    const handleSubmit = () => {
        travelPlan.title = title;
        travelPlan.description = description;
        travelPlan.startDate = new Date(startDate);
        travelPlan.endDate = new Date(endDate);
        travelPlan.tags = activeTags;
        travelPlan.photos = photos;
        travelPlan.participants = participants;
    }

    if (isLoading) {
        return <Page><p>Загрузка...</p></Page>;
    }

    if (error) {
        return <Page><p>{error}</p></Page>;
    }

    return (
        <Page>
            <ContentSection title="Информация">
                <TextInput value={title} onChange={setTitle}/>
                <TextInput value={description} onChange={setDescription} multiline={true}/>
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
            <FileInput label="Добавить">
                {photos.map(
                    photo =>
                        <Cell key={photo.id}>{photo.url}</Cell>
                )}
            </FileInput>
        </Page>
    )
}