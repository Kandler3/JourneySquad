import { TravelPlan } from "@/models/TravelPlan.ts";
export interface User {
    id: number;
    name: string;
    age?: number;
    bio?: string;
    gender?: string;
    avatarUrl?: string;
    activeTravelPlans?: TravelPlan[];
  }