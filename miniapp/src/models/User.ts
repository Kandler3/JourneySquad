import { TravelPlan } from "@/models/TravelPlan.ts";
export interface User {
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