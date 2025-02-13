import { FILES_BASE_URL } from '@/config.ts'


export class TravelPlanPhoto {
    id: number;
    url: string;

    constructor(id: number, url: string) {
        this.id = id;
        this.url = url;
    }

    getAbsoluteUrl() {
        return `${FILES_BASE_URL}${this.url}`
    }
}
