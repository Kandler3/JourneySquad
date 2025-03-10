import {ApiService} from "@/services/api/ApiServiceInterface.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {initDataRaw} from "@telegram-apps/sdk-react";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import {User} from "@/models/User.ts";

export class DevApi implements ApiService {
    headers = {
        Authorization: `tma ${initDataRaw}`
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
            method: "PUT",
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
}