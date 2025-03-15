import {FC} from "react";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanCard} from "@/components/TravelPlanCard/TravelPlanCard.tsx";

import "./TravelPlanHorizontalCardList.css"

type TravelPlanHorizontalCardListProps = {
    travelPlans: TravelPlan[]
}

export const TravelPlanHorizontalCardList : FC<TravelPlanHorizontalCardListProps> = ({travelPlans}) => {
    return (
        <div className="cards">
            {
                travelPlans.map(
                    (travelPlan) =>
                        <TravelPlanCard
                            key={travelPlan.id}
                            travelPlan={travelPlan}
                            style="horizontal"
                        />
                )
            }
        </div>
    )
}
