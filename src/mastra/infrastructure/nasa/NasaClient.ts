export interface NasaRequestParams {
  [key: string]: string | number | boolean | undefined;
}

export class NasaClient {
  private static instance: NasaClient;
  private readonly baseUrl = process.env.NASA_BASE_URL || "https://api.nasa.gov";
  private readonly apiKey: string;

  private constructor() {
    const apiKey = process.env.NASA_API_KEY;
    if(!apiKey) {
      throw new Error("NASA_API_KEY is not set. Add it to your .env file");
    }
    this.apiKey = apiKey;
  }

  public static getInstance(): NasaClient {
    if (!NasaClient.instance) {
      NasaClient.instance = new NasaClient();
    }
    return NasaClient.instance;
  }

  public async get<T>(path: string, params: NasaRequestParams = {}): Promise<T> {
    const url = new URL(path, this.baseUrl);
    url.searchParams.set('api_key', this.apiKey);

    for (const [key, value] of Object.entries(params)) {
      if (value != undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `NASA API request failed (${response.status} ${response.statusText}: ${body})`,
      )
    }

    return (await response.json()) as T;
  }
}

