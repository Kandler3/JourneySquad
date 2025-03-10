import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { Divider } from "@telegram-apps/telegram-ui";
import { User } from "@/models/User.ts";
import { TravelPlansCarousel } from "@/components/TravelPlanCarousel/TravelPlanCarousel.tsx";
import { fetchUser } from "@/services/travelPlanService";
import { Icon28Pencil } from "@/icons/Edit.tsx";
import "./Profile.css";

export const UserProfilePage: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) {
                setError("ID пользователя не указан");
                setIsLoading(false);
                return;
            }

            try {
                const userData = await fetchUser(Number(userId));
                setUser(userData);
            } catch (err) {
                setError("Ошибка при загрузке данных пользователя");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [userId]);

    const handleEditProfile = () => {
        if (!userId) return;
        navigate(`/edit-profile/${userId}`); 
    };

    if (isLoading) {
        return <Page>Загрузка...</Page>;
    }

    if (error) {
        return <Page>{error}</Page>;
    }

    if (!user) {
        return <Page>Пользователь не найден</Page>;
    }

    return (
        <Page>
            <div className="userProfileContainer">
                <div className="userInfoRow">
                    <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="userAvatar"
                    />
                    <div className="userInfo">
                        <div className="nameAndEditButton">
                            <h1 className="userName">
                                {user.name}, {user.age}
                            </h1>
                            {Number(userId) === -1 && (
                                <button
                                    className="editButton"
                                    onClick={handleEditProfile}
                                    style={{ background: "none", border: "none", cursor: "pointer" }}
                                >
                                    <Icon28Pencil />
                                </button>
                            )}
                        </div>
                        <p className="userBio">{user.bio}</p>
                    </div>
                </div>
                <div className="additionalInfo">
                <Divider className="customDivider" />
                    <div className="infoItem">
                        <strong>Пол:</strong>
                        <div>{user.gender}</div>
                    </div>
                    <Divider className="customDivider" />
                </div>
                <h2 className="sectionTitle"> Активные поездки</h2>
                <TravelPlansCarousel travelPlans={user.activeTravelPlans || []} />
            </div>
        </Page>
    );
};