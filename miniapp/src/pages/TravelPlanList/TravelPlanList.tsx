import {FC, useState, useEffect} from "react";

import {Page} from "@/components/Page.tsx";
import {fetchTravelPlans} from "@/services/travelPlanService.ts";
import {TravelPlanCard} from "@/components/TravelPlanCard/TravelPlanCard.tsx";
import {TravelPlan} from "@/models/TravelPlan.ts";

import './TravelPlanList.css'
import {SearchBar} from "@/components/SearchBar/SearchBar.tsx";
import {TravelPlanFilter} from "@/components/TravelPlanFilter/TravelPlanFilter.tsx";
import { TravelPlanSort } from "@/components/TravelPlanSort/TravelPlanSort.tsx";
import {Button} from "@telegram-apps/telegram-ui";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";
import {useLocation, useNavigate} from "react-router-dom";

export const TravelPlanListPage : FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
    const [query, setQuery] = useState<TravelPlanQuery>(
        TravelPlanQuery
            .fromSearchParams(
                new URLSearchParams(location.search)
            )
    )
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        navigate("?" + query.toSearchParams().toString(), {replace: true})
    }, [query]);


    useEffect(() => {
        const loadTravelPlans = async () => {
            try {
                const plans = await fetchTravelPlans(query);
                setTravelPlans(plans);
            } catch (err) {
                console.error('Ошибка при загрузке travel plans:', err);
                setError("Ошибка загрузки данных");
            } finally {
                setIsLoading(false);
            }
        };

        loadTravelPlans();
    }, [query]);

    const [ isFilterOpened, setFilterOpened ] = useState<boolean>(false)
    const setFilterOpenedOpposite = () => setFilterOpened(!isFilterOpened)

    const [isSortOpened, setSortOpened] = useState<boolean>(false);
    const [titleSortOrder, setTitleSortOrder] = useState<string>("");
    const [dateSortOrder, setDateSortOrder] = useState<string>("");

    const handleSearchBarSubmit = (titleQuery: string) => {
        const newQuery = query.clone();
        newQuery.query = titleQuery;
        setQuery(newQuery);
    }

    const handleSearchBarReset = () => {
        const newQuery = query.clone();
        newQuery.query = undefined;
        setQuery(newQuery);
    }

    const saveSortChanges = (titleSortOrder: string, dateSortOrder: string) => {
        const newQuery = query.clone();
        if (titleSortOrder) {
            newQuery.sortBy = "title";
            newQuery.sortAscending = (titleSortOrder === "asc");
        } else if (dateSortOrder) {
            newQuery.sortBy = "date";
            newQuery.sortAscending = (dateSortOrder === "asc");
        } else {
            newQuery.sortBy = undefined;
            newQuery.sortAscending = undefined;
        }

        setQuery(newQuery);
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
                <SearchBar onSubmit={handleSearchBarSubmit} onReset={handleSearchBarReset}/>
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
                            <TravelPlanCard
                                key={travelPlan.id}
                                travelPlan={travelPlan}
                                style="horizontal"
                            />
                    )
                }
                </div>
            </div>
            <TravelPlanFilter
                isFilterOpened={isFilterOpened}
                setIsFilterOpened={setFilterOpened}
                query={query}
                setQuery={setQuery}
            />
            <TravelPlanSort
                isSortOpened={isSortOpened}
                setIsSortOpened={setSortOpened}
                titleSortOrder={titleSortOrder}
                setTitleSortOrder={setTitleSortOrder}
                dateSortOrder={dateSortOrder}
                setDateSortOrder={setDateSortOrder}
                saveSortChanges={saveSortChanges}
            />
        </Page>
    )
}