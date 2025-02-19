import { ApiService } from './ApiServiceInterface.ts';
import { TravelPlan } from '@/models/TravelPlan.ts';
import {TravelPlanTag} from "@/models/types.ts";
import {travelPlans} from "@/services/api/mocks/TravelPlanMocks.ts";
import {travelPlanTags} from "@/services/api/mocks/TravelPlanTagMocks.ts";

export class MockApiService implements ApiService {
    async getTravelPlans(): Promise<TravelPlan[]> {
        return Promise.resolve(travelPlans);
    }

    async getTravelPlanTags(): Promise<TravelPlanTag[]> {
        return Promise.resolve(travelPlanTags);
    }
}
