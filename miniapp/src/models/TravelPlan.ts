import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import { DifferentYearsFormat, DifferentMonthsFormat, SameMonthsFormat } from "@/utils/DateFormats.ts";

export class TravelPlan {
    id : number | undefined = undefined;
    title: string | undefined = undefined;
    description: string | undefined = undefined;
    startDate: Date | undefined = undefined;
    endDate: Date | undefined = undefined;
    author: User | undefined = undefined;
    tags: TravelPlanTag[] = [];
    photos: TravelPlanPhoto[] = [];
    participants: User[] = [];

    constructor(
        id?: number,
        title?: string,
        description?: string,
        startDate?: Date,
        endDate?: Date,
        author?: User,
        tags: TravelPlanTag[] = [],
        photos: TravelPlanPhoto[] = [],
        participants: User[] = []
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.author = author;
        this.tags = tags;
        this.photos = photos;
        this.participants = participants;
    }

    getDatesString(): string | undefined {
        if (!this.startDate || !this.endDate) {
            return undefined;
        }

        if (this.startDate.getFullYear() !== this.endDate.getFullYear())
        {
            return DifferentYearsFormat(this.startDate, this.endDate);
        }

        if (this.startDate.getMonth() !== this.endDate.getMonth())
        {
            return DifferentMonthsFormat(this.startDate, this.endDate);
        }

        return SameMonthsFormat(this.startDate, this.endDate);
    }

    getStartDateString(): string | undefined {
        if (!this.startDate)
            return undefined;

        return this.startDate.toLocaleDateString("ru-Ru");
    }

    getEndDateString(): string | undefined {
        if (!this.endDate)
            return undefined;

        return this.endDate.toLocaleDateString("ru-Ru");
    }

    isValid(): boolean {
        return (
            (this.title !== undefined && this.title.length > 0)
            && this.startDate !== undefined
            && this.endDate !== undefined
            && this.author !== undefined
        )
    }

}