import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { Divider } from "@telegram-apps/telegram-ui";
import { User } from "@/models/User.ts";
import { TravelPlansCarousel } from "@/components/TravelPlanCarousel/TravelPlanCarousel.tsx";
import { fetchUser } from "@/services/travelPlanService";
import "./Profile.css";

export const UserProfilePage: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        <h1 className="userName">
                            {user.name}, {user.age}
                        </h1>
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
                    <div className="infoItem">
                        <strong>Предпочитаемые страны:</strong>
                        <div>{user.preferredCountries?.join(", ")}</div>
                    </div>
                    <Divider className="customDivider" />
                    <div className="infoItem">
                        <strong>Увлечения:</strong>
                        <div>{user.hobbies?.join(", ")}</div>
                    </div>
                    <Divider className="customDivider" />
                    <div className="infoItem">
                        <strong>Интересы:</strong>
                        <div>{user.interests?.join(", ")}</div>
                    </div>
                    <Divider className="customDivider" />
                </div>

                <h2 className="sectionTitle">Ваши активные поездки</h2>
                <TravelPlansCarousel travelPlans={user.activeTravelPlans || []} />
            </div>
        </Page>
    );
};