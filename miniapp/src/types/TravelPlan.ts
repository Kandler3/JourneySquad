import { Participant } from "@/types/Participant.ts";

export interface TravelPlan {
    id: string; 
    name: string;
    description: string;
    dates: string;
    photos: string[]; 
    participants: Participant[];
}