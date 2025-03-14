import {FC, useContext, useEffect, useState} from "react";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {useNavigate} from "react-router-dom";
import {createTravelPlan} from "@/services/travelPlanService.ts";
import {TravelPlanForm} from "@/components/TravelPlanForm/TravelPlanForm.tsx";
import {Page} from "@/components/Page.tsx";
import {UserContext} from "@/contexts/UserContext.ts";

export const TravelPlanCreatePage : FC = () => {
    const {currentUser} = useContext(UserContext)
    const [travelPlan, setTravelPlan] = useState<TravelPlan>(new TravelPlan())
    const navigate = useNavigate()

    useEffect(() => {travelPlan.author = currentUser}, [currentUser])

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

        const newTravelPlan = await createTravelPlan(travelPlan);
        console.log("new travel plan", newTravelPlan)
        setTravelPlan(newTravelPlan)
        console.log("navigating to ", newTravelPlan.id)
        navigate(`/travel-plans/${newTravelPlan.id}`)
    }

    const handleDelete = () => {navigate("/travel-plans")}

    return (
        <Page>
            <TravelPlanForm travelPlan={travelPlan} onSubmit={handleSubmit} onDelete={handleDelete}/>
        </Page>
    )
}
