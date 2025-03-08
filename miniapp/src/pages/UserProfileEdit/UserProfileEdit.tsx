import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { User } from "@/models/User.ts";
import { TextInput } from "@/components/TextInput/TextInput";
import { fetchUser, updateUser } from "@/services/travelPlanService";
import { SaveButton } from "@/components/SaveButton/SaveButton";
import { ContentInlineSection } from "@/components/ContentInlineSection/ContentInlineSection";
import "./UserProfileEdit.css";

export const EditProfilePage: FC = () => {
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

            if (Number(userId) !== -1) {
                setError("Доступ к редактированию запрещен");
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

    const handleSave = async () => {
        if (!user || !userId) return;

        try {
            await updateUser(Number(userId), {
                name: user.name,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
                preferredCountries: user.preferredCountries,
                hobbies: user.hobbies,
                interests: user.interests,
            });
            navigate(`/profile/${userId}`);
        } catch (err) {
            console.error("Ошибка при сохранении данных:", err);
        }
    };

    const handleChange = (field: keyof User, value: string | string[] | number) => {
        if (!user) return;

        setUser((prevUser) => ({
            ...prevUser!,
            [field]: value,
        }));
    };

    const handleAgeChange = (value: string) => {
        const age = Number(value);
        if (!isNaN(age)) {
            handleChange("age", age);
        } else {
            handleChange("age", 0);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === "string" && user) {
                    setUser((prevUser) => ({
                        ...prevUser!,
                        avatarUrl: result,
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
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
            <div className="editProfileContainer">
                <div className="twoColumnsSection">
                    <div className="leftColumn">
                        <div className="avatarSection">
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="userAvatar"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="avatarInput"
                                style={{ display: "none" }}
                                id="avatarInput"
                            />
                            <label htmlFor="avatarInput" className="avatarUploadLabel">
                                Загрузить фото
                            </label>
                        </div>
                    </div>

                    <div className="rightColumn">
                        <div className="inlineFieldsContainerForColumn">
                            <ContentInlineSection title="Имя">
                                <TextInput
                                    value={user.name}
                                    onChange={(value) => handleChange("name", value)}
                                    placeholder="Имя"
                                />
                            </ContentInlineSection>

                            <ContentInlineSection title="Возраст">
                                <TextInput
                                    value={user.age?.toString() || "0"}
                                    onChange={handleAgeChange}
                                    placeholder="Возраст"
                                />
                            </ContentInlineSection>
                        </div>
                    </div>
                </div>
                <div className="inlineFieldsContainer">
                    <ContentInlineSection title="Описание">
                        <TextInput
                            value={user.bio || ""}
                            onChange={(value) => handleChange("bio", value)}
                            placeholder="Биография"
                            multiline
                        />
                    </ContentInlineSection>

                    <ContentInlineSection title="Пол">
                        <TextInput
                            value={user.gender || ""}
                            onChange={(value) => handleChange("gender", value)}
                            placeholder="Пол"
                        />
                    </ContentInlineSection>

                    <ContentInlineSection title="Предпочитаемые страны">
                        <TextInput
                            value={user.preferredCountries?.join(", ") || ""}
                            onChange={(value) =>
                                handleChange("preferredCountries", value.split(", "))
                            }
                            placeholder="Предпочитаемые страны"
                        />
                    </ContentInlineSection>

                    <ContentInlineSection title="Увлечения">
                        <TextInput
                            value={user.hobbies?.join(", ") || ""}
                            onChange={(value) =>
                                handleChange("hobbies", value.split(", "))
                            }
                            placeholder="Увлечения"
                        />
                    </ContentInlineSection>

                    <ContentInlineSection title="Интересы">
                        <TextInput
                            value={user.interests?.join(", ") || ""}
                            onChange={(value) =>
                                handleChange("interests", value.split(", "))
                            }
                            placeholder="Интересы"
                        />
                    </ContentInlineSection>
                </div>
                <SaveButton onClick={handleSave}>
                    Сохранить
                </SaveButton>
            </div>
        </Page>
    );
};