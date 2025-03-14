import {ApiService} from "@/services/api/ApiServiceInterface.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {User} from "@/models/User.ts";
import {TravelPlanTag} from "@/models/types.ts";
import {retrieveLaunchParams} from "@telegram-apps/sdk-react";

export class DevApi implements ApiService {
    headers;

    constructor() {
        const { initDataRaw } = retrieveLaunchParams();
        this.headers = {
            Authorization: `tma ${initDataRaw}`
        }
    }

    async getTravelPlans(query?: TravelPlanQuery): Promise<TravelPlan[]> {
        let url = "/api/travel_plans";
        if (query) {
            url += `?${query.toSearchParams().toString()}`;
        }
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers
        });

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }

        return (await resp.json()).map(tp => TravelPlan.fromJSON(tp));
    }

    async getTravelPlan(id: number): Promise<TravelPlan> {
        const url = `/api/travel_plans/${id}`;
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers,
        })

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }

        return (TravelPlan.fromJSON(await resp.json()))
    }

    async updateTravelPlan(id: number, updates: Partial<TravelPlanPhoto>): Promise<void> {
        const url = `/api/travel_plans/${id}`;
        const resp = await fetch(url, {
            method: "PATCH",
            headers: {...this.headers, "Content-Type": "application/json"},
            body: JSON.stringify(updates),
        });

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
    }

    async createTravelPlan(travelPlan: TravelPlan): Promise<TravelPlan> {
        const url = `/api/travel_plans`;
        const resp = await fetch(url, {
            method: "POST",
            headers: {...this.headers, "Content-Type": "application/json"},
            body: JSON.stringify(travelPlan),
        })

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }

        return TravelPlan.fromJSON(await resp.json());
    }

    async deleteTravelPlan(id: number): Promise<void> {
        const url = `/api/travel_plans/${id}`;
        const resp = await fetch(url, {
            method: "DELETE",
            headers: this.headers,
        })

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
    }

    async getCurrentUser(): Promise<User> {
        const url = `/api/users/login`;
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers,
        })

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }

        return resp.json();
    }

    async updateUser(id: number, updates: Partial<User>): Promise<void> {
        const url = `/api/users/${id}`;
        const resp = await fetch(url, {
            method: "PATCH",
            headers: {
                ...this.headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });
    
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
    }
    
    async getUser(id: number, getProfile: boolean = true): Promise<User> {
        const url = `/api/users/${id}?get_profile=${getProfile}`;
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers,
        });
    
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    }
    
    async joinTravelPlan(travelPlanId: number): Promise<void> {
        const currentUser = await this.getCurrentUser(); 
        const url = `/api/travel_plans/${travelPlanId}/participants`;
        const resp = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ userId: currentUser.id }),
        });
    
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
    }

    async deleteParticipant(travelPlanId: number, participantId: number): Promise<void> {
        const url = `/api/travel_plans/${travelPlanId}/participants/${participantId}`;
        const resp = await fetch(url, {
            method: "DELETE",
            headers: this.headers,
        });
    
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
    }

    async getTravelPlanTag(id: number): Promise<TravelPlanTag> {
        const url = `/api/travel_plan_tags/${id}`;
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers,
        })

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    }

    async getTravelPlanTags(): Promise<TravelPlanTag[]> {
        const url = `/api/travel_plan_tags`;
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers,
        })

        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    }

    async deleteUser(id: number): Promise<void> {
        const url = `/api/users/${id}`;
        const resp = await fetch(url, {
            method: "DELETE",
            headers: this.headers,
        });
    
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
    }
    
}