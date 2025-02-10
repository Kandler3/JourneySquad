import { ApiService } from './api.ts';
import { MockApiService } from './MockApi.ts';

export function createApiService(): ApiService {
    return new MockApiService();
}
