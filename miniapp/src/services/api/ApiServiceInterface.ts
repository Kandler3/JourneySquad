import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag} from "@/models/types.ts";
import {User} from "@/models/types.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";

export interface ApiService {
    getTravelPlans(query?: TravelPlanQuery): Promise<TravelPlan[]>;
    getTravelPlan(id: number): Promise<TravelPlan | null>;
    createTravelPlan(travelPlan: TravelPlan): Promise<TravelPlan>;
    updateTravelPlan(id: number, updates: Partial<TravelPlan>): Promise<void>;
    deleteTravelPlan(id: number): Promise<void>;
    getTravelPlanTags(): Promise<TravelPlanTag[]>;
    getTravelPlanTag(id: number): Promise<TravelPlanTag | null>;
    getUser(id: number, getProfile?: boolean): Promise<User>;
    updateUser(id: number, updates: Partial<User>): Promise<void>;
    getCurrentUser(): Promise<User>;
    joinTravelPlan(travelPlanId: number): Promise<void>
    deleteParticipant(travelPlanId: number, participantId: number): Promise<void>
}