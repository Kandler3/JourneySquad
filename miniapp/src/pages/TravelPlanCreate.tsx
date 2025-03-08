import {FC, useState} from "react";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {useNavigate} from "react-router-dom";
import {createTravelPlan} from "@/services/travelPlanService.ts";
import {TravelPlanForm} from "@/components/TravelPlanForm/TravelPlanForm.tsx";
import {Page} from "@/components/Page.tsx";

export const TravelPlanCreatePage : FC = () => {
    const [travelPlan, setTravelPlan] = useState<TravelPlan>(new TravelPlan())
    const navigate = useNavigate()

    const handleSubmit = async (
        title: string,
        description: string,
        startDate: Date,
        endDate: Date,
        activeTags: TravelPlanTag[],
        photos: TravelPlanPhoto[],
        participants: User[],
    ) => {
        travelPlan.title = title;
        travelPlan.description = description;
        travelPlan.startDate = startDate;
        travelPlan.endDate = endDate;
        travelPlan.tags = activeTags;
        travelPlan.photos = photos;
        travelPlan.participants = participants;

        setTravelPlan(await createTravelPlan(travelPlan))
        navigate(`/travel_plans/${travelPlan.id}`)
    }

    return (
        <Page>
            <TravelPlanForm travelPlan={travelPlan} onSubmit={handleSubmit}/>
        </Page>
    )
}
