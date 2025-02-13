import { ApiService } from './ApiServiceInterface.ts';
import { MockApiService } from './MockApi.ts';

export function createApiService(): ApiService {
    return new MockApiService();
}
