import {FC} from "react";
import {TravelPlanTag} from "@/models/types.ts";
import {Button} from "@telegram-apps/telegram-ui";

type TravelPlanTagProps = {
    tag: TravelPlanTag
    onClick: (tag: TravelPlanTag) => void
    isActive: boolean
}

export const TravelPlanTagComponent: FC<TravelPlanTagProps> = ({tag, onClick, isActive}) => {
    const onClickAction = () => onClick(tag)
    return (
        <Button
            mode={isActive ? "filled" : "outline"}
            onClick={onClickAction}
        >
            {tag.name}
        </Button>
    )
}