import {FC, useEffect, useState} from "react";
import {Page} from "@/components/Page.tsx";
import {ContentSection} from "@/components/ContentSection/ContentSection.tsx";
import {Text} from "@telegram-apps/telegram-ui";
import {ContentInlineSection} from "@/components/ContentInlineSection/ContentInlineSection.tsx";
import {DateInput} from "@/components/DateInput/DateInput.tsx";
import {useParams} from "react-router-dom";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {fetchTravelPlan} from "@/services/travelPlanService.ts";

export const EditTravelPlan : FC = () => {
    const travelPlanId = useParams()
    const {travelPlan, setTravelPlan } = useState<TravelPlan>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTravelPlan = async () => {
            try {
                const plan = await fetchTravelPlan(travelPlanId);
                setTravelPlan(plan);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        if (travelPlanId !== null)
            loadTravelPlan();
    }, []);

    if (isLoading) {
        return <Page><p>Загрузка...</p></Page>;
    }

    if (error) {
        return <Page><p>{error}</p></Page>;
    }

    return (
        <Page>
            <ContentSection title="Информация">
                <Text Component="input" type="text"/>
                <Text Component="input" type="text"/>
            </ContentSection>
            <ContentSection title="Даты">
                <ContentInlineSection title="Прибытие">
                    <DateInput value={travelPlan.startDate} onChange={setStartDate} />
                </ContentInlineSection>
                <ContentInlineSection title="Отъезд">
                    <DateInput value={travelPlan.endDate} onChange={setEndDate} />
                </ContentInlineSection>
            </ContentSection>
        </Page>
    )
}