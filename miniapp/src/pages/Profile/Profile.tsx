import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { Divider } from "@telegram-apps/telegram-ui";
import { User } from "@/models/User.ts";
import { TravelPlan } from "@/models/TravelPlan.ts";
import { TravelPlansCarousel } from "@/components/TravelPlanCarousel/TravelPlanCarousel.tsx";
import "./Profile.css";

// Моковые данные для примера
const mockUser: User = {
    id: 1,
    name: "Иван Иванов",
    age: 28,
    bio: "Люблю путешествовать, фотографировать и исследовать новые культуры. Мечтаю побывать в Японии и Исландии",
    gender: "Мужской",
    preferredCountries: ["Япония", "Исландия", "Италия", "Франция", "Испания", "Германия", "Швейцария"],
    hobbies: ["Фотография", "Горные походы", "Кулинария", "Чтение", "Велоспорт"],
    interests: ["История", "Архитектура", "Природа", "Искусство", "Технологии"],
    avatarUrl: "https://randomuser.me/api/portraits/men/33.jpg",
    activeTravelPlans: [
        new TravelPlan(
            1,
            "Путешествие в горы",
            "Незабываемое путешествие в горы с друзьями",
            new Date("2023-09-19"),
            new Date("2023-09-21")
        ),
        new TravelPlan(
            2,
            "Отдых на море",
            "Релакс на пляжах Греции",
            new Date("2023-10-10"),
            new Date("2023-10-15")
        ),
    ],
};

export const UserProfilePage: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // потом реализуем
        setUser(mockUser);
    }, [userId]);

    if (!user) {
        return <Page>Загрузка...</Page>;
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