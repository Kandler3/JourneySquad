import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { PhotoCarousel } from "@/components/PhotoCarousel/PhotoCarousel.tsx";
import { TravelPlan } from "@/models/TravelPlan";
import "./TravelPlanViewPage.css";
import { ParticipantsList } from "@/components/ParticipantList/ParticipantList.tsx";
import { fetchTravelPlan, joinTravelPlan, deleteParticipant, fetchCurrentUser } from "@/services/travelPlanService";

export const TravelPlanViewPage: FC = () => {
    const { travelPlanId } = useParams<{ travelPlanId: string }>();
    const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isJoined, setIsJoined] = useState<boolean>(false);
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
                if (plan) { 
                    const currentUser = await fetchCurrentUser();
                    const isParticipant = plan.participants.some(p => p.id === currentUser.id);
                    setIsJoined(isParticipant);
                }
            } catch (err) {
                setError("Ошибка при загрузке данных");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTravelPlan();
    }, [travelPlanId]);

    const handleParticipantClick = (participantId: number) => {
        navigate(`/profile/${participantId}`);
    };

    const handleJoinClick = async () => {
        if (!travelPlanId) return;

        try {
            await joinTravelPlan(Number(travelPlanId));
            setIsJoined(true);
        } catch (err) {
            setError("Ошибка при присоединении к путешествию");
            console.error(err);
        }
    };

    const handleLeaveClick = async () => {
        if (!travelPlanId) return;

        try {
            const currentUser = await fetchCurrentUser();
            await deleteParticipant(Number(travelPlanId), currentUser.id);
            setIsJoined(false);
        } catch (err) {
            setError("Ошибка при выходе из путешествия");
            console.error(err);
        }
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
        avatarUrl: user.avatarUrl || "default-avatar-url",
    }));

    return (
        <Page>
            <PhotoCarousel photos={photoUrls} />
            <div className="pageContainer">
                <div className="container">
                    <div className="header">
                        <div>
                            <div className="tags">
                                <div className="tags-content">
                                    {travelPlan.tags.map((tag, index) => (
                                        <div key={index} className="tag">
                                            {tag.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h1 className="title">{travelPlan.title}</h1>
                            <p className="dates">{travelPlan.getDatesString()}</p>
                        </div>
                    </div>
                    <p className="description">{travelPlan.description}</p>
                    <div className="participants-container">
                        <ParticipantsList
                            participants={participants}
                            onParticipantClick={handleParticipantClick}
                        />
                    </div>
                    <button 
                        className={isJoined ? "leaveButton" : "joinButton"} 
                        onClick={isJoined ? handleLeaveClick : handleJoinClick}
                    >
                        {isJoined ? "Вы уже присоединились" : "Присоединиться"}
                    </button>
                </div>
            </div>
        </Page>
    );
};