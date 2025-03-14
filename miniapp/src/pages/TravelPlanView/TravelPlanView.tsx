import {FC, useEffect, useMemo, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { PhotoCarousel } from "@/components/PhotoCarousel/PhotoCarousel.tsx";
import { TravelPlan } from "@/models/TravelPlan";
import {User} from "@/models/User";
import "./TravelPlanViewPage.css";
import { ParticipantsList } from "@/components/ParticipantList/ParticipantList.tsx";
import { fetchTravelPlan, joinTravelPlan, deleteParticipant, fetchCurrentUser } from "@/services/travelPlanService";
import { Icon28Pencil } from "@/icons/Edit.tsx";


export const TravelPlanViewPage: FC = () => {
    const { travelPlanId } = useParams<{ travelPlanId: string }>();
    const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
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
                    setCurrentUser(currentUser);
                    const isUserAuthor = plan.author?.id === currentUser.id;
                    setIsAuthor(isUserAuthor);
                    const isParticipant = plan.participants.some(p => p.id === currentUser.id);
                    setIsJoined(isParticipant || isUserAuthor);

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

    //useEffect(() => {
    //    if (travelPlan && currentUser) {
    //        const isUserAuthor = travelPlan.author?.id === currentUser.id;
    //        setIsAuthor(isUserAuthor);
    //
    //        const isParticipant = travelPlan.participants.some(p => p.id === currentUser.id);
    //        setIsJoined(isParticipant || isUserAuthor);
    //    }
    //}, [travelPlan?.participants, currentUser]);

    const participants = useMemo(() => {
        if (!travelPlan || !currentUser) return [];

        return [
            ...travelPlan.participants
                .filter(p => p.id !== currentUser.id)
                .map(user => ({
                    id: user.id,
                    name: user.name || "Unknown",
                    avatarUrl: user.avatarUrl || "default-avatar-url",
                })),
            ...(travelPlan.participants.some(p => p.id === currentUser.id) ? [{
                id: currentUser.id,
                name: currentUser.name || "Unknown",
                avatarUrl: currentUser.avatarUrl || "default-avatar-url",
            }] : []),
        ];
    }, [travelPlan, currentUser]);

    const handleParticipantClick = (participantId: number) => {
        navigate(`/profile/${participantId}`);
    };

    const handleEditTravelPlan = () => {
        navigate(`/travel-plans/${travelPlanId}/edit`);
    };

    const handleJoinClick = async () => {
        if (!travelPlanId || isJoining) return;


        setIsJoining(true);
        try {
            await joinTravelPlan(Number(travelPlanId));
            const updatedPlan = await fetchTravelPlan(Number(travelPlanId));
            setTravelPlan(updatedPlan);
            setIsJoined(true);
        } catch (err) {
            setError("Ошибка при присоединении к путешествию");
            console.error(err);
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeaveClick = async () => {
        if (!travelPlanId || isJoining) return;

        setIsJoining(true);
        try {
            const currentUser = await fetchCurrentUser();
            await deleteParticipant(Number(travelPlanId), currentUser.id);
            const updatedPlan = await fetchTravelPlan(Number(travelPlanId));
            setTravelPlan(updatedPlan);
            setIsJoined(false);
        } catch (err) {
            setError("Ошибка при выходе из путешествия");
            console.error(err);
        } finally {
            setIsJoining(false);
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

    return (
        <Page>
            <PhotoCarousel photos={photoUrls} />
            <div className="pageContainer">
                <div className="container">
                    {(Number(travelPlan.author?.id) === currentUser?.id) && (
                        <button
                            className="editButton"
                            onClick={handleEditTravelPlan}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            <Icon28Pencil />
                        </button>
                    )}
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
                    {!isAuthor && (
                        <button
                            className={isJoined ? "leaveButton" : "joinButton"}
                            onClick={isJoined ? handleLeaveClick : handleJoinClick}
                            disabled={isJoining}
                        >
                            {isJoining ? "Обработка..." : isJoined ? "Вы уже присоединились" : "Присоединиться"}
                        </button>
                    )}
                </div>
            </div>
        </Page>
    );
};
