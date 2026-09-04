import type { NasaClient } from '../../infrastructure/nasa/NasaClient';

export const ROVER_NAMES = ['curiosity', 'opportunity', 'spirit', 'perseverance'] as const;
export type RoverName = (typeof ROVER_NAMES)[number];

export interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: { name: string; full_name: string };
  rover: { name: string; status: string };
}

interface MarsPhotoResponse {
  photos: MarsPhoto[]
}

export interface GetPhotosParams {
  rover?: RoverName;
  earthDate?: string;
  sol?: number;
  camera?: string;
}

export class MarsRoverService {
  constructor (private readonly client: NasaClient){}

  public async getPhotos(params: GetPhotosParams): Promise<MarsPhoto[]> {
    const { rover, earthDate, sol, camera } = params;

    const response = await this.client.get<MarsPhotosResponse>(
      `/mars-photos/api/v1/rovers/${rover}/photos`,
      { earth_date: earthDate, sol, camera },
    );

    return response.photos;
  }
}
