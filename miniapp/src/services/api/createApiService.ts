import { ApiService } from './ApiServiceInterface.ts';
import { MockApiService } from './MockApi.ts';
import {DevApi} from "@/services/api/DevApi.ts";

export function createApiService(): ApiService {
    if (import.meta.env.VITE_USE_MOCK_API === "true")
        return new MockApiService();
    return new DevApi();
}
