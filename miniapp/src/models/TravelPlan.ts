import {TravelPlanPhoto, TravelPlanTag, User} from "@/models/types.ts";

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
        if (this.startDate.getYear() !== this.endDate.getFullYear())
        {
            const options = { year: "2-digit", month: "long", day: "numeric" }
            return this.startDate.toLocaleDateString("ru-RU", options) + " - " + this.endDate.toLocaleDateString("ru-RU", options);
        }

        if (this.startDate.getMonth() !== this.endDate.getMonth())
        {
            const options = { month: "long", day: "numeric" }
            return this.startDate.toLocaleDateString("ru-RU", options) + " - " + this.endDate.toLocaleDateString("ru-RU", options);
        }

        return `${this.startDate.getDay()} - ${this.endDate.getDay} ${this.startDate.toLocaleDateString("ru-Ru", { month: "long" })}`
    }
}