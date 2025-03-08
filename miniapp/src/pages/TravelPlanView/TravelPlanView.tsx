import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { PhotoCarousel } from "@/components/PhotoCarousel/PhotoCarousel.tsx";
import { TravelPlan } from "@/types/TravelPlan";
import "./TravelPlanViewPage.css";
import { ParticipantsList } from "@/components/ParticipantList/ParticipantList.tsx";

const mockTravelPlan: TravelPlan = {
    id: "1",
    name: "Путешествие в горы",
    description: "Незабываемое путешествие в горы с друзьями",
    dates: "19 - 21 сентября",
    photos: [
        "https://cs9.pikabu.ru/post_img/big/2020/02/26/11/1582741757190718681.jpg", 
        "https://krasnayapolyanaresort.ru/assets/upload/10_foto_gor_ot_kotoryix_zaxvatyivaet_dux_8.jpg.webp",
        "https://s1.1zoom.me/b4149/638/Mountains_Forests_Alps_549350_1920x1080.jpg", 
        "https://7themes.su/_ph/27/507274575.jpg"
    ],
    participants: [
        { id: "1", name: "Анна", photoUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: "2", name: "Иван", photoUrl: "https://randomuser.me/api/portraits/men/33.jpg" },
        { id: "3", name: "Мария", photoUrl: "https://randomuser.me/api/portraits/women/22.jpg" },
    ],
};

export const TravelPlanViewPage: FC = () => {
    const { travelPlanId } = useParams<{ travelPlanId: string }>();
    const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        setTravelPlan(mockTravelPlan);
    }, [travelPlanId]);

    if (!travelPlan) {
        return <Page>Loading...</Page>;
    }
    const handleParticipantClick = (participantId: string) => {
        navigate(`/profile/${participantId}`);
    };

    return (
        <Page>
            <PhotoCarousel photos={travelPlan.photos} />
            <div className="pageContainer">
                <div className="container">
                    <div className="header">
                        <div>
                            <h1 className="title">{travelPlan.name}</h1>
                            <p className="dates">{travelPlan.dates}</p>
                        </div>
                        <button className="joinButton">Присоединиться</button>
                    </div>
                    <p className="description">{travelPlan.description}</p>
                    <ParticipantsList
                        participants={travelPlan.participants}
                        onParticipantClick={handleParticipantClick}
                    />
                </div>
            </div>
        </Page>
    );
};