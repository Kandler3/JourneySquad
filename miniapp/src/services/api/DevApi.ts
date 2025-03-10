import {ApiService} from "@/services/api/ApiServiceInterface.ts";
import {TravelPlanQuery} from "@/services/api/TravelPlanQuery.ts";
import {TravelPlan} from "@/models/TravelPlan.ts";
import {initDataRaw} from "@telegram-apps/sdk-react";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";

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
            headers: this.headers,
        });
        return (await resp.json()).map(tp => TravelPlan.fromJSON(tp));
    }

    async getTravelPlan(id: number): Promise<TravelPlan> {
        const url = `/api/travel_plans/${id}`;
        const resp = await fetch(url, {
            method: "GET",
            headers: this.headers,
        })

        return (TravelPlan.fromJSON(await resp.json()))
    }

    async updateTravelPlan(id: number, updates: Partial<TravelPlanPhoto>): Promise<void> {
        const url = `/api/travel_plans/${id}`;
        await fetch(url, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(updates),
        });
    }

    async createTravelPlan(travelPlan: TravelPlan): Promise<TravelPlan> {
        const url = `/api/travel_plans`;
        const resp = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(travelPlan),
        })

        return TravelPlan.fromJSON(await resp.json());
    }

    async deleteTravelPlan(id: number): Promise<void> {
        const url = `/api/travel_plans/${id}`;
        await fetch(url, {
            method: "DELETE",
            headers: this.headers,
        })
    }
}