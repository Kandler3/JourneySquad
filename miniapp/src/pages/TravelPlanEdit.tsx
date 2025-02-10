import {FC} from "react";
import {Page} from "@/components/Page.tsx";
import {useParams} from "react-router-dom";

export const TravelPlanEditPage : FC = () => {
    const { travelPlanId } = useParams();
    return (
        <Page>
            <h1>Editing {travelPlanId}</h1>
        </Page>
    )
}