import type { NasaClient } from "../../infrastructure/nasa/NasaClient";

export interface Apod {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  media_type: 'image' | 'video';
  copyright: string;
}

export class ApodService {
  constructor(private readonly client: NasaClient) {}

  public async getByDate(date?: string): Promise<Apod> {
    return this.client.get<Apod>('planetary/apod', { date });
  }
}
