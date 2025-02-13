import { ApiService } from './ApiServiceInterface.ts';
import { TravelPlan } from '@/models/TravelPlan.ts';
import { TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";

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
                [],
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
}
