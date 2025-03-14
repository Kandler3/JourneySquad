import { FC } from 'react';

import './TravelPlanCard.css';
import {Avatar, AvatarStack, Caption, Subheadline} from "@telegram-apps/telegram-ui";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {useNavigate} from "react-router-dom";
import {Card} from "@/components/Card/Card.tsx";

type TravelPlanCardProps = {
    travelPlan: TravelPlan;
    style: "horizontal" | "vertical";
}

export const TravelPlanCard: FC<TravelPlanCardProps> = ({travelPlan, style}) => {
    const navigate = useNavigate();
    const onClick = () => navigate(`/travel-plans/${travelPlan.id}`)

    const image = `url('${travelPlan.photos?.at(0)?.getAbsoluteUrl()}')`
    return (
        <Card style={style} image={image} onClick={onClick}>
                <div className="title">
                    <Subheadline level="1">{travelPlan.title}</Subheadline>
                    <Caption level="2">{travelPlan.getDatesString()}</Caption>
                </div>
            {style === "horizontal" ?
                <AvatarStack>
                    {travelPlan.participants.slice(0, 4).map(user =>
                        <Avatar key={`avatar-${user.id}`} src={user.avatarUrl} acronym={user.name?.at(0) ?? "A"}/>
                    )}
                </AvatarStack>
                :
                <></>
            }
        </Card>
    )
}