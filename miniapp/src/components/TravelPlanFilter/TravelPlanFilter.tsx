import {useState, FC, Dispatch, SetStateAction, useEffect} from "react";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { SectionHeader } from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";
import { DateInput } from "@/components/DateInput/DateInput.tsx";
import "./TravelPlanFilter.css";
import {TravelPlanTag} from "@/models/types.ts";
import {fetchTravelPlanTags} from "@/services/travelPlanService.ts";
import {TravelPlanTagComponent} from "@/components/TravelPlanTag/TravelPlanTag.tsx";
import {SaveButton} from "@/components/SaveButton/SaveButton.tsx";
import {ResetButton} from "@/components/ResetButton/ResetButton.tsx";
import {ContentSection} from "@/components/ContentSection/ContentSection.tsx";
import {ContentInlineSection} from "@/components/ContentInlineSection/ContentInlineSection.tsx";
import {Modal} from "@telegram-apps/telegram-ui";

type TravelPlanFilterProps = {
    isFilterOpened: boolean;
    setIsFilterOpened: Dispatch<SetStateAction<boolean>>;
};

export const TravelPlanFilter: FC<TravelPlanFilterProps> = ({ isFilterOpened, setIsFilterOpened }) => {
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
    }

    const handleResetFilter = () => {
        setIsFilterOpened(false);
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
                <div className="tags">
                    <SectionHeader large={true}>Теги</SectionHeader>
                    <div className="tags-content">
                        {tags.map((tag) =>
                            <TravelPlanTagComponent
                                key={tag.id}
                                onClick={handleTagClick}
                                tag={tag}
                                isActive={tagIsActive(tag)}
                            />
                        )}
                    </div>
                </div>
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
