import { FC, useEffect, useState } from "react";
import { Page } from "@/components/Page.tsx";
import { CardSection } from "@/components/CardSection/CardSection.tsx";
import { Card } from "@/components/Card/Card.tsx";
import { fetchTravelPlans } from "@/services/travelPlanService.ts";
import { TravelPlan } from "@/models/TravelPlan.ts";
import { useNavigate } from "react-router-dom";
import './Home.css'
import {TravelPlanHorizontalCardList} from "@/components/TravelPlanHorizontalCardList/TravelPlanHorizontalCardList.tsx";

export const HomePage: FC = () => {
    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTravelPlans = async () => {
            try {
                const plans = await fetchTravelPlans();
                const latestPlans = plans.slice(-6);
                setTravelPlans(latestPlans);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        loadTravelPlans();
    }, []);

    const handleCardClick = (travelPlanId: number | undefined) => {
        navigate(`/travel-plans/${travelPlanId ?? 0}`);
    };
    if (isLoading) {
        return <Page><p>Загрузка...</p></Page>;
    }

    if (error) {
        return <Page><p>{error}</p></Page>;
    }

    return (
        <div className="page">
            <Page>
                <div className="container" style={{paddingRight: "10px"}}>
                    <div className="title">Последние путешествия</div>
                    <TravelPlanHorizontalCardList travelPlans={travelPlans}/>
                </div>
            </Page>
        </div>
    );
};