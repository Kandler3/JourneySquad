import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { PhotoCarousel } from "@/components/PhotoCarousel/PhotoCarousel.tsx";
import { TravelPlan } from "@/models/TravelPlan";
import "./TravelPlanViewPage.css";
import { ParticipantsList } from "@/components/ParticipantList/ParticipantList.tsx";
import { fetchTravelPlan } from "@/services/travelPlanService";

export const TravelPlanViewPage: FC = () => {
    const { travelPlanId } = useParams<{ travelPlanId: string }>();
    const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTravelPlan = async () => {
            if (!travelPlanId) {
                setError("ID путешествия не указан");
                setIsLoading(false);
                return;
            }

            try {
                const plan = await fetchTravelPlan(Number(travelPlanId));
                setTravelPlan(plan);
            } catch (err) {
                setError("Ошибка при загрузке данных");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        console.log("travelPlanId из useParams:", travelPlanId);
        loadTravelPlan();
    }, [travelPlanId]);

    const handleParticipantClick = (participantId: number) => {
        navigate(`/profile/${participantId}`);
    };

    if (isLoading) {
        return <Page>Загрузка...</Page>;
    }

    if (error) {
        return <Page>{error}</Page>;
    }

    if (!travelPlan) {
        return <Page>Путешествие не найдено</Page>;
    }
    const photoUrls = travelPlan.photos.map(photo => photo.getAbsoluteUrl());
    const participants = travelPlan.participants.map(user => ({
        id: user.id,
        name: user.name || "Unknown",
        photoUrl: user.avatarUrl || "default-avatar-url",
    }));

    return (
        <Page>
            <PhotoCarousel photos={photoUrls} />
            <div className="pageContainer">
                <div className="container">
                    <div className="header">
                        <div>
                            <h1 className="title">{travelPlan.title}</h1>
                            <p className="dates">{travelPlan.getDatesString()}</p>
                        </div>
                        <button className="joinButton">Присоединиться</button>
                    </div>
                    <p className="description">{travelPlan.description}</p>
                    <ParticipantsList
                        participants={participants}
                        onParticipantClick={handleParticipantClick}
                    />
                </div>
            </div>
        </Page>
    );
};