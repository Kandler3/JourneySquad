import {FC, useState, useEffect} from "react";

import {Page} from "@/components/Page.tsx";
import {fetchTravelPlans} from "@/services/travelPlanService.ts";
import {TravelPlanCardHorizontal} from "@/components/TravelPlanCard/TravelPlanCard.tsx";
import {TravelPlan} from "@/models/TravelPlan.ts";

import './TravelPlanList.css'
import {SearchBar} from "@/components/SearchBar/SearchBar.tsx";
import {TravelPlanFilter} from "@/components/TravelPlanFilter/TravelPlanFilter.tsx";
import { TravelPlanSort } from "@/components/TravelPlanSort/TravelPlanSort.tsx";
import {Button} from "@telegram-apps/telegram-ui";

export const TravelPlanListPage : FC = () => {
    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTravelPlans = async () => {
            try {
                const plans = await fetchTravelPlans();
                setTravelPlans(plans);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        loadTravelPlans();
    }, []);

    const [ isFilterOpened, setFilterOpened ] = useState<boolean>(false)
    const setFilterOpenedOpposite = () => setFilterOpened(!isFilterOpened)

    const [isSortOpened, setSortOpened] = useState<boolean>(false);

    const [ageSortOrder, setAgeSortOrder] = useState<string>("");
    const [countrySortOrder, setCountrySortOrder] = useState<string>("");
    const [dateSortOrder, setDateSortOrder] = useState<string>("");

    const saveSortChanges = (ageSortOrder: string, countrySortOrder: string, dateSortOrder: string) => {
        console.log("Сортировка сохранена:", { ageSortOrder, countrySortOrder, dateSortOrder });
        // Можно добавить логику для сохранения на сервере или в локальном хранилище
    };

    if (isLoading) {
        return <Page><p>Загрузка...</p></Page>;
    }

    if (error) {
        return <Page><p>{error}</p></Page>;
    }

    return (
        <Page>
            <div className="content">
                <SearchBar/>
                <div className="buttons">
                    <Button
                        size="s"
                        mode={isFilterOpened ? "filled" : "outline"}
                        onClick={setFilterOpenedOpposite}
                        className="upper-button"
                    >
                        Фильтр
                    </Button>
                    <Button
                        size="s"
                        mode={isSortOpened ? "filled" : "outline"}
                        onClick={() => setSortOpened(!isSortOpened)}
                        className="upper-button"
                    >
                        Сортировка
                    </Button>
                </div>
                <div className="cards">
                {
                    travelPlans.map(
                        (travelPlan) =>
                            <TravelPlanCardHorizontal key={travelPlan.id} travelPlan={travelPlan}/>
                    )
                }
                </div>
            </div>
            <TravelPlanFilter isFilterOpened={isFilterOpened} setIsFilterOpened={setFilterOpened}/>
            <TravelPlanSort
                isSortOpened={isSortOpened}
                setIsSortOpened={setSortOpened}
                ageSortOrder={ageSortOrder}
                setAgeSortOrder={setAgeSortOrder}
                countrySortOrder={countrySortOrder}
                setCountrySortOrder={setCountrySortOrder}
                dateSortOrder={dateSortOrder}
                setDateSortOrder={setDateSortOrder}
                saveSortChanges={saveSortChanges}
            />
        </Page>
    )
}