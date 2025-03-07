import { ApiService } from './ApiServiceInterface.ts';
import { TravelPlan } from '@/models/TravelPlan.ts';
import { TravelPlanTag } from '@/models/types.ts';
import { travelPlans } from '@/services/api/mocks/TravelPlanMocks.ts';
import { travelPlanTags } from '@/services/api/mocks/TravelPlanTagMocks.ts';
import { TravelPlanQuery } from '@/services/api/TravelPlanQuery.ts';

export class MockApiService implements ApiService {
    async getTravelPlans(query?: TravelPlanQuery): Promise<TravelPlan[]> {
        const filteredPlans = travelPlans
            .filter(plan => {
                // Фильтрация по userId
                if (query?.userId && (!plan.author || plan.author.id !== query.userId)) {
                    return false;
                }

                // Фильтрация по дате начала
                if (query?.startDate && (!plan.startDate || new Date(plan.startDate) < query.startDate)) {
                    return false;
                }

                // Фильтрация по дате окончания
                if (query?.endDate && (!plan.endDate || new Date(plan.endDate) > query.endDate)) {
                    return false;
                }

                // Фильтрация по тегам (если нужно, чтобы TravelPlan содержал все указанные теги)
                if (query?.tags?.length) {
                    // Если у плана нет тегов, отбрасываем сразу
                    if (!plan.tags?.length) return false;
                    // Проверяем, что каждый тег из query.tags есть в plan.tags
                    const hasAllTags = query.tags.every(tag => plan.tags.includes(tag));
                    if (!hasAllTags) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                // Если сортировка не задана, не меняем порядок
                if (!query?.sortBy) return 0;

                // Определяем результат сравнения
                let result: number;
                if (query.sortBy === 'date') {
                    // Сортируем по startDate
                    if (!a.startDate)
                        if (!b.startDate)
                            result = 0;
                        else
                            result = -1;
                    else if (!b.startDate)
                        result = 1;
                    else
                        result = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                } else {
                    // Сортируем по title
                    if (!a.title)
                        if (!b.title)
                            result = 0;
                        else
                            result = -1;
                    else if (!b.title)
                        result = 1;
                    else
                        result = a.title.localeCompare(b.title);
                }

                // Если требуется убывающий порядок
                return query.sortDescending ? -result : result;
            });

        return Promise.resolve(filteredPlans);
    }

    async getTravelPlanTags(): Promise<TravelPlanTag[]> {
        return Promise.resolve(travelPlanTags);
    }

    async getTravelPlan(id: number): Promise<TravelPlan | null> {
        return (await this.getTravelPlans()).find(p => {
            if (p.id === undefined) return false;
            return p.id === id;
        }) ?? null;
    }
}