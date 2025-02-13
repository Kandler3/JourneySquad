import {TravelPlanTag, User} from "@/models/types.ts";
import {TravelPlanPhoto} from "@/models/TravelPlanPhoto.ts";
import { DifferentYearsFormat, DifferentMonthsFormat, SameMonthsFormat } from "@/utils/DateFormats.ts";

export class TravelPlan {
    id : number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    author: User;
    tags: TravelPlanTag[];
    photos: TravelPlanPhoto[];
    participants: User[];

    constructor(
        id: number,
        title: string,
        description: string,
        startDate: Date,
        endDate: Date,
        author: User,
        tags: TravelPlanTag[],
        photos: TravelPlanPhoto[],
        participants: User[]
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

    getDatesString(): string {
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


}