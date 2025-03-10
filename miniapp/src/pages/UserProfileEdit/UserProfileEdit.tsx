import {FC, useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { User } from "@/models/User.ts";
import { TextInput } from "@/components/TextInput/TextInput";
import { updateUser } from "@/services/travelPlanService";
import { SaveButton } from "@/components/SaveButton/SaveButton";
import { ContentInlineSection } from "@/components/ContentInlineSection/ContentInlineSection";
import { Button } from "@telegram-apps/telegram-ui";
import "./UserProfileEdit.css";
import {UserContext} from "@/contexts/UserContext.ts";

export const EditProfilePage: FC = () => {
    const currentUser = useContext(UserContext);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoading(false)

            }
        };
    
        loadUserData();
    }, [currentUser]);

    const handleSave = async () => {
        if (!user) return;

        try {
            await updateUser(Number(user.id), {
                name: user.name,
                age: user.age,
                gender: selectedGender || user.gender,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
            });
            navigate(`/profile/-1`);
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

    const handleGenderSelect = (gender: string) => {
        setSelectedGender((prevGender) => (prevGender === gender ? "" : gender));
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
                        <div className="button-group">
                            <Button
                                mode={selectedGender === "Мужской" ? "filled" : "outline"}
                                onClick={() => handleGenderSelect("Мужской")}
                            >
                                Мужской
                            </Button>
                            <Button
                                mode={selectedGender === "Женский" ? "filled" : "outline"}
                                onClick={() => handleGenderSelect("Женский")}
                            >
                                Женский
                            </Button>
                        </div>
                    </ContentInlineSection>
                </div>
                <SaveButton onClick={handleSave}>
                    Сохранить
                </SaveButton>
            </div>
        </Page>
    );
};