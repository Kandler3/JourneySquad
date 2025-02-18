import { ApiService } from './ApiServiceInterface.ts';
import { TravelPlan } from '@/models/TravelPlan.ts';
import { TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {TravelPlanTag} from "@/models/types.ts";

export class MockApiService implements ApiService {
    async getTravelPlans(): Promise<TravelPlan[]> {
        return Promise.resolve([
            new TravelPlan(
                1,
                'Путешествие в Париж',
                'Описание путешествия',
                new Date(2024, 0, 12),
                new Date(2024, 0, 17),
                {
                    id: 1,
                },
                [
                    { id: 3, name: "Город" },
                    { id: 6, name: "Культура" },
                    { id: 7, name: "Романтика" },
                ],
                [
                    new TravelPlanPhoto(
                        1,
                        "/736x/a9/56/05/a956051792e768cfbf07af132ee638f2.jpg",
                    )
                ],
                []
            ),
        ]);
    }

    async getTravelPlanTags(): Promise<TravelPlanTag[]> {
        return Promise.resolve([
            { id: 1, name: "Пляж" },
            { id: 2, name: "Горы" },
            { id: 3, name: "Город" },
            { id: 4, name: "Приключение" },
            { id: 5, name: "Отдых" },
            { id: 6, name: "Культура" },
            { id: 7, name: "Романтика" },
            { id: 8, name: "Семья" },
            { id: 9, name: "Бюджет" },
            { id: 10, name: "Люкс" },
        ])
    }
}
