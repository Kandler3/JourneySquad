import {createApiService} from './api/createApiService';

const apiService = createApiService();

export async function fetchTravelPlans(): TravelPlan[] {
    try {
        return await apiService.getTravelPlans();
    } catch (error) {
        console.error('Ошибка при загрузке travel plans:', error);
        throw error;
    }
}
