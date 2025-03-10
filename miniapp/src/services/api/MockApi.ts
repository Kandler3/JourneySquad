import { ApiService } from './ApiServiceInterface.ts';
import { TravelPlan } from '@/models/TravelPlan.ts';
import { TravelPlanTag } from '@/models/types.ts';
import { travelPlans } from '@/services/api/mocks/TravelPlanMocks.ts';
import { travelPlanTags } from '@/services/api/mocks/TravelPlanTagMocks.ts';
import { TravelPlanQuery } from '@/services/api/TravelPlanQuery.ts';
import {users} from "@/services/api/mocks/UserMocks.ts";
import { User } from "@/models/User.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";

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
                return query.sortAscending ? result : -result;
            });

        return Promise.resolve(filteredPlans);
    }

    async getTravelPlanTags(): Promise<TravelPlanTag[]> {
        return Promise.resolve(travelPlanTags);
    }
    async getUser(id: number): Promise<User> {
        const user = users.find((u) => u.id === id);

        if (!user) {
            throw new Error(`Пользователь с ID ${id} не найден`);
        }

        user.activeTravelPlans = travelPlans.filter(
            tp =>
                tp.author?.id === user.id
                || tp.participants.map(p => p.id).includes(id)
        );
        return Promise.resolve(user);
    }

    async getTravelPlan(id: number): Promise<TravelPlan | null> {
        return (await this.getTravelPlans()).find(p => {
            if (p.id === undefined) return false;
            return p.id === id;
        }) ?? null;
    }

    async updateTravelPlan(id: number, updates: Partial<TravelPlan>): Promise<void> {
        const travelPlan = travelPlans.find(tp => tp.id === id);
        if (!travelPlan) {
            return Promise.reject("Travel plan не найден");
        }

        if (updates.photos)
        {
            let id = Math.max(...travelPlan.photos.map(p => p.id));
            updates.photos = updates.photos.map(p => new TravelPlanPhoto(id++, p.url))
        }

        Object.assign(travelPlan, updates); // Обновляем только измененные поля
        return Promise.resolve();
    }

    async createTravelPlan(travelPlan: TravelPlan): Promise<TravelPlan> {
        travelPlan.id = Math.max(...travelPlans.map(p => p.id ?? 0), 0) + 1;
        travelPlan.author = users[0];
        if (travelPlan.isValid()) {
            travelPlans.push(travelPlan);
            return travelPlan;
        }
        return Promise.reject()
    }

    async deleteTravelPlan(id: number): Promise<void> {
        const index = travelPlans.findIndex(tp => tp.id === id);
        if (index !== -1)
            travelPlans.splice(index, 1);
    }
    
    async updateUser(id: number, updates: Partial<User>): Promise<void> {
        const user = users.find((u) => u.id === id);
        if (!user) {
            return Promise.reject(`Пользователь с ID ${id} не найден`);
        }

        Object.assign(user, updates);
        return Promise.resolve();
    }

    async getTravelPlanTag(id: number): Promise<TravelPlanTag | null> {
        return travelPlanTags.find(p => p.id === id) ?? null;
    }

    async getCurrentUser(): Promise<User> {
        return users[0];
    }

    async joinTravelPlan(travelPlanId: number): Promise<void> {
        const travelPlan = travelPlans.find(tp => tp.id === travelPlanId);
        if (!travelPlan) {
            return Promise.reject("Travel plan не найден");
        }
        const currentUser = await this.getCurrentUser();
        const isAlreadyParticipant = travelPlan.participants.some(p => p.id === currentUser.id);
        if (isAlreadyParticipant) {
            return Promise.reject("Пользователь уже является участником");
        }
        travelPlan.participants.push(currentUser);
        return Promise.resolve();
    }

    async deleteParticipant(travelPlanId: number, participantId: number): Promise<void> {
        const travelPlan = travelPlans.find(tp => tp.id === travelPlanId);
        if (!travelPlan) {
            return Promise.reject("Travel plan не найден");
        }
        const participantIndex = travelPlan.participants.findIndex(p => p.id === participantId);
        if (participantIndex === -1) {
            return Promise.reject("Участник не найден");
        }
        travelPlan.participants.splice(participantIndex, 1);
        return Promise.resolve();
    }
}