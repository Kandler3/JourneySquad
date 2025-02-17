import {FC} from "react";
import {Page} from "@/components/Page.tsx";
import {useParams} from "react-router-dom";
import { ParticipantCard } from "@/components/ParticipantCard/ParticipantCard";
export const TravelPlanViewPage : FC = () => {
    const { travelPlanId } = useParams();
    return (
        <Page>
            <h1>View {travelPlanId}</h1>
            {/* Временный блок для просмотра ParticipantCard */}
                <div>
                    <div className="participant-card-wrapper">
                        <ParticipantCard
                            name="Анна"
                            photoUrl="https://randomuser.me/api/portraits/women/44.jpg"
                             />
                    </div>
                </div>
        </Page>
    )
}