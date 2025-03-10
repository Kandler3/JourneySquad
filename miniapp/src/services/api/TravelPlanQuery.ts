import {TravelPlanTag} from "@/models/types.ts";
import {fetchTravelPlanTag} from "@/services/travelPlanService.ts";

type sortParameters = "date" | "title";

export class TravelPlanQuery {
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    tags?: TravelPlanTag[];
    sortBy?: sortParameters;
    sortAscending?: boolean;

    toSearchParams() : URLSearchParams {
        const searchParams = new URLSearchParams();
        if (this.userId)
            searchParams.append("user_id", this.userId.toString());

        if (this.startDate)
            searchParams.append("startDate", this.startDate.toString());

        if (this.endDate)
            searchParams.append("endDate", this.endDate.toString());

        if (this.tags)
            this.tags.map(tag => searchParams.append("tag", tag.id.toString()));

        if (this.sortBy)
        {
            searchParams.append("sort_by", this.sortBy.toString());
            searchParams.append("ascending", this.sortAscending?.toString() ?? "false");
        }

        return searchParams;
    }

    static fromSearchParams(params: URLSearchParams) : TravelPlanQuery {
        const query = new TravelPlanQuery();

        if (params.has("user_id"))
            query.userId = Number(params.get("user_id"));

        if (params.has("start_date"))
            query.startDate = new Date(params.get("start_date") ?? "");

        if (params.has("end_date"))
            query.endDate = new Date(params.get("end_date") ?? "");

        if (params.has("tags")) {
            query.tags = [];
            params.getAll("tags").forEach((id) => {
                const tag = fetchTravelPlanTag(Number(id));
                tag.then(tag => {
                    if (tag) query.tags?.push(tag)
                })
            })
        }

        if (params.has("sort_by")) {
            query.sortBy = params.get("sort_by") as sortParameters;
            query.sortAscending = params.get("ascending") === "true";
        }

        return query;
    }
}