import {TravelPlanTag} from "@/models/types.ts";
import {FC} from "react";
import {
    SectionHeader
} from "@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader";
import {TravelPlanTagComponent} from "@/components/TravelPlanTag/TravelPlanTag.tsx";

import './TravelPlanTagsSelector.css'


type TravelPlanTagsSelectorProps = {
    tags: TravelPlanTag[],
    title: string,
    isActivePredicate: (tag: TravelPlanTag) => boolean,
    onClick: (tag: TravelPlanTag) => void,
}

export const TravelPlanTagsSelector : FC<TravelPlanTagsSelectorProps> = ({tags, title, isActivePredicate, onClick}) => {
    return (
        <div className="tags">
            <SectionHeader large={true}>{ title }</SectionHeader>
            <div className="tags-content">
                {tags.map((tag) =>
                    <TravelPlanTagComponent
                        key={tag.id}
                        onClick={onClick}
                        tag={tag}
                        isActive={isActivePredicate(tag)}
                    />
                )}
            </div>
        </div>
    )
}