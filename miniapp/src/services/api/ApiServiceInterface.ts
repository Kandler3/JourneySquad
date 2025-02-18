import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag} from "@/models/types.ts";

export interface ApiService {
    getTravelPlans(): Promise<TravelPlan[]>;
    getTravelPlanTags(): Promise<TravelPlanTag[]>;
}