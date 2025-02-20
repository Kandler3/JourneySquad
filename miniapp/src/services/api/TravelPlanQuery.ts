import {TravelPlanTag} from "@/models/types.ts";

type sortParameters = "date" | "title";

export interface TravelPlanQuery {
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    tags?: TravelPlanTag[];
    sortBy?: sortParameters;
    sortDescending?: boolean;
}