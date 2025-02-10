import {TravelPlan} from "@/models/TravelPlan.ts";

export interface ApiService {
    getTravelPlans(): Promise<TravelPlan[]>;
}
