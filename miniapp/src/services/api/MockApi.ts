import { ApiService } from './types';
import { TravelPlan } from '../../models/TravelPlan.ts';

export class MockApiService implements ApiService {
    async getTravelPlans(): Promise<TravelPlan[]> {
        return Promise.resolve([
            new TravelPlan(
                1,
                'Путешествие в Париж',
                'Описание путешествия',
                new Date(),
                new Date(),
                {
                    id: 1,
                },
                [],
                [],
                []
    ),
        ]);
    }
}
