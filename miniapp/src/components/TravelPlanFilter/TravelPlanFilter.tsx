import {useState, FC, Dispatch, SetStateAction, useEffect} from "react";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { DateInput } from "@/components/DateInput/DateInput.tsx";
import "./TravelPlanFilter.css";
import {TravelPlanTag} from "@/models/types.ts";
import {fetchTravelPlanTags} from "@/services/travelPlanService.ts";
import {SaveButton} from "@/components/SaveButton/SaveButton.tsx";
import {ResetButton} from "@/components/ResetButton/ResetButton.tsx";
import {ContentSection} from "@/components/ContentSection/ContentSection.tsx";
import {ContentInlineSection} from "@/components/ContentInlineSection/ContentInlineSection.tsx";
import {Modal} from "@telegram-apps/telegram-ui";
import {TravelPlanTagsSelector} from "@/components/TravelPlanTagsSelector/TravelPlanTagsSelector.tsx";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";
import {DateFromLocaleString} from "@/utils/DateFormats.ts";

type TravelPlanFilterProps = {
    isFilterOpened: boolean;
    setIsFilterOpened: Dispatch<SetStateAction<boolean>>;
    query: TravelPlanQuery;
    setQuery: Dispatch<SetStateAction<TravelPlanQuery>>;
};

export const TravelPlanFilter: FC<TravelPlanFilterProps> = ({ isFilterOpened, setIsFilterOpened, query, setQuery }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tags, setTags] = useState<TravelPlanTag[]>([])
    const [activeTags, setActiveTags] = useState<TravelPlanTag[]>([]);

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
        if (tagIsActive(tag))
        {
            setActiveTags(activeTags.filter((t) => t.id !== tag.id));
        }
        else
        {
            setActiveTags([...activeTags, tag]);
        }
        console.log(activeTags)
    }

    const handleSaveFilter = () => {
        setIsFilterOpened(false);
        const newQuery = query.clone();

        if (!startDate) {
            newQuery.startDate = undefined;
        } else {
            const start = DateFromLocaleString(startDate);
            if (start)
                newQuery.startDate = start;
        }
        if (!endDate) {
            newQuery.endDate = undefined;
        } else {
            const end = DateFromLocaleString(endDate);
            if (end)
                newQuery.endDate = end;
        }
        newQuery.tags = activeTags;

        setQuery(newQuery);
    }

    const handleResetFilter = () => {
        setIsFilterOpened(false);
        const newQuery = query.clone();

        newQuery.startDate = undefined;
        newQuery.endDate = undefined
        newQuery.tags = undefined;
        setQuery(newQuery)
    }

    return (
        <Modal
            open={isFilterOpened}
            header={<ModalHeader>Фильтр</ModalHeader>}
            onOpenChange={setIsFilterOpened}
            className="travel-plan-filter-modal"
        >
            <div className="travel-plan-filter-content">
                <ContentSection title="Даты">
                    <ContentInlineSection title="От">
                        <DateInput value={startDate} onChange={setStartDate} />
                    </ContentInlineSection>
                    <ContentInlineSection title="До">
                        <DateInput value={endDate} onChange={setEndDate} />
                    </ContentInlineSection>
                </ContentSection>
                <TravelPlanTagsSelector
                    tags={tags}
                    title="Теги"
                    isActivePredicate={tagIsActive}
                    onClick={handleTagClick}
                />
            </div>
            <div className="lower-buttons">
                <SaveButton onClick={handleSaveFilter}>
                    Сохранить
                </SaveButton>
                <ResetButton onClick={handleResetFilter}>
                    Сбросить
                </ResetButton>
            </div>
        </Modal>
    );
};
