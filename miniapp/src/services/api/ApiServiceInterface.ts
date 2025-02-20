import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag} from "@/models/types.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";

export interface ApiService {
    getTravelPlans(query?: TravelPlanQuery): Promise<TravelPlan[]>;
    getTravelPlanTags(): Promise<TravelPlanTag[]>;
}