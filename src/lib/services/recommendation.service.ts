interface EmbeddingInput {
  texts: string[];
  ids: string[];
  metadatas?: Record<string, string>[];
}

interface QueryInput {
  texts: string[];
  n_results?: number;
}

export class RecommendationService {
  private readonly baseUrl: string;
  private readonly collectionName: string;

  constructor() {
    const baseUrl = process.env.RECOMMENDATION_API_URL;
    const collectionName = process.env.RECOMMENDATION_COLLECTION;
    if (!baseUrl) {
      throw new Error('RECOMMENDATION_API_URL is not set');
    }
    if (!collectionName) {
      throw new Error('RECOMMENDATION_COLLECTION is not set');
    }
    this.baseUrl = baseUrl;
    this.collectionName = collectionName;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Recommendation API error: ${response.statusText}`);
    }

    return response.json();
  }

  async addRoute(routeId: string, tags: string[]): Promise<void> {
    const input: EmbeddingInput = {
      texts: [tags.join(' ')],
      ids: [routeId],
    };

    await this.request(`/collections/${this.collectionName}/add`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async removeRoute(routeId: string): Promise<void> {
    const input: EmbeddingInput = {
      texts: [''],
      ids: [routeId],
    };

    await this.request(`/collections/${this.collectionName}/delete`, {
      method: 'DELETE',
      body: JSON.stringify(input),
    });
  }

  async getRecommendationsByTags(tags: string[], limit: number = 5): Promise<string[]> {
    const input: QueryInput = {
      texts: [tags.join(' ')],
      n_results: limit,
    };

    const result = await this.request<{ ids: string[][] }>(
      `/collections/${this.collectionName}/query`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );

    return result.ids[0];
  }

  async searchRoutes(query: string, limit: number = 10): Promise<string[]> {
    const input: QueryInput = {
      texts: [query],
      n_results: limit,
    };

    const result = await this.request<{ ids: string[][] }>(
      `/collections/${this.collectionName}/query`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );

    return result.ids[0];
  }
}

export const recommendationService = new RecommendationService(); 