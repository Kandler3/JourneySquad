import { FC } from 'react';

import './TravelCard.css';
import {Avatar, AvatarStack, Caption, Subheadline} from "@telegram-apps/telegram-ui";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {useNavigate} from "react-router-dom";

type TravelPlanCardProps = {
    travelPlan: TravelPlan;
}

export const TravelPlanCardHorizontal: FC<TravelPlanCardProps> = ({travelPlan}) => {
    const navigate = useNavigate();
    const onClick = () => navigate(`/travel-plans/${travelPlan.id}`)

    const style = {
        backgroundImage: `url('${travelPlan.photos.at(0)?.getAbsoluteUrl()}')`,
    }
    return (
        <div className="travel-plan-card-horizontal"
             onClick={onClick}
        >
            <div className="image" style={style}/>
            <div className="travel-plan-card-content">
                <div className="title">
                    <Subheadline level="1">{travelPlan.title}</Subheadline>
                    <Caption level="2">{travelPlan.getDatesString()}</Caption>
                </div>
                <AvatarStack>
                    <Avatar acronym="A"/>
                    <Avatar acronym="A"/>
                    <Avatar acronym="A"/>
                    <Avatar acronym="A"/>
                </AvatarStack>
            </div>
        </div>
    )
}