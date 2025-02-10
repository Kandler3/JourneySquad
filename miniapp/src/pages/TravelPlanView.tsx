import {FC} from "react";
import {Page} from "@/components/Page.tsx";
import {useParams} from "react-router-dom";

export const TravelPlanViewPage : FC = () => {
    const { travelPlanId } = useParams();
    return (
        <Page>
            <h1>View {travelPlanId}</h1>
        </Page>
    )
}