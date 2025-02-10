import { FC } from 'react';

import './TravelCard.css';
import {Caption, Subheadline} from "@telegram-apps/telegram-ui";
import {TravelPlan} from "@/models/TravelPlan.ts";

type TravelPlanCardProps = {
    travelPlan: TravelPlan;
}

export const TravelPlanCardHorizontal: FC<TravelPlanCardProps> = ({travelPlan}) => {
    const style = {
        backgroundImage: `url("${travelPlan.photos.at(0)}")`,
    }
    return (
        <div className="travel-plan-card-horizontal"
             style={style}>
            <div className="title">
                <Subheadline level="1">{travelPlan.title}</Subheadline>
                <Caption level="2">{travelPlan.getDatesString()}</Caption>
            </div>
        </div>
    )
}