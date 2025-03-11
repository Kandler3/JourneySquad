import { TravelPlan } from "@/models/TravelPlan.ts";
export type User = {
    id: number;
    name: string;
    age?: number;
    bio?: string;
    gender?: string;
    preferredCountries?: string[];
    hobbies?: string[];
    interests?: string[];
    avatarUrl?: string;
    activeTravelPlans?: TravelPlan[];
}

export type TravelPlanTag = {
    id: number;
    name: string;
}