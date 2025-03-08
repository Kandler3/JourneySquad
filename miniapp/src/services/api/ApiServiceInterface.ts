import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag} from "@/models/types.ts";
import {User} from "@/models/types.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";

export interface ApiService {
    getTravelPlans(query?: TravelPlanQuery): Promise<TravelPlan[]>;
    getTravelPlanTags(): Promise<TravelPlanTag[]>;
    getTravelPlan(id: number): Promise<TravelPlan | null>;
    createTravelPlan(travelPlan: TravelPlan): Promise<TravelPlan>;
    updateTravelPlan(id: number, updates: Partial<TravelPlan>): Promise<void>;
    deleteTravelPlan(id: number): Promise<void>;
    getUser(id: number): Promise<User>;
}