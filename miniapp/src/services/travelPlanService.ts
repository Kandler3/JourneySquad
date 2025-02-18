import {createApiService} from './api/createApiService';

import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanTag} from "@/models/types.ts";

const apiService = createApiService();

export async function fetchTravelPlans(): Promise<TravelPlan[]> {
    try {
        return await apiService.getTravelPlans();
    } catch (error) {
        console.error('Ошибка при загрузке travel plans:', error);
        throw error;
    }
}

export async function fetchTravelPlanTags(): Promise<TravelPlanTag[]> {
    try {
        return await apiService.getTravelPlanTags();
    } catch (error) {
        console.error('Ошибка при за tags:', error);
        throw error;
    }
}