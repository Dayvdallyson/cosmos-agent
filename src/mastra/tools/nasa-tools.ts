import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

import { NasaClient } from '../infrastructure/nasa/NasaClient';
import { ApodService } from '../application/nasa/ApodService';
import { MarsRoverService, ROVER_NAMES } from '../application/nasa/MarsRoverService';

// Composition root: one Singleton client shared by every service.
const client = NasaClient.getInstance();
const apodService = new ApodService(client);
const marsRoverService = new MarsRoverService(client);

export const apodTool = createTool({
  id: 'get-astronomy-picture-of-the-day',
  description:
    "Get NASA's Astronomy Picture of the Day (APOD): title, explanation and image/video URL. Optionally for a specific date.",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
      .optional()
      .describe('Date in YYYY-MM-DD format. Defaults to today when omitted.'),
  }),
  outputSchema: z.object({
    date: z.string(),
    title: z.string(),
    explanation: z.string(),
    url: z.string(),
    mediaType: z.string(),
    copyright: z.string().optional(),
  }),
  // v1 signature: (inputData, context). We only need inputData here.
  execute: async ({ date }) => {
    const apod = await apodService.getByDate(date);
    return {
      date: apod.date,
      title: apod.title,
      explanation: apod.explanation,
      url: apod.url,
      mediaType: apod.media_type,
      copyright: apod.copyright,
    };
  },
});

export const marsRoverPhotosTool = createTool({
  id: 'get-mars-rover-photos',
  description:
    'Get real photos taken by a NASA Mars rover. Provide a rover and either an earth date (YYYY-MM-DD) or a martian sol (day number since landing).',
  inputSchema: z.object({
    rover: z.enum(ROVER_NAMES).default('curiosity').describe('Which Mars rover to query.'),
    earthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe('Earth date in YYYY-MM-DD format.'),
    sol: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe('Martian sol (day since landing). Alternative to earthDate.'),
    camera: z.string().optional().describe('Camera abbreviation, e.g. NAVCAM, FHAZ.'),
    limit: z.number().int().positive().max(10).default(5).describe('Max photos to return.'),
  }),
  outputSchema: z.object({
    count: z.number(),
    photos: z.array(
      z.object({
        id: z.number(),
        imgSrc: z.string(),
        earthDate: z.string(),
        camera: z.string(),
        rover: z.string(),
      }),
    ),
  }),
  execute: async ({ rover, earthDate, sol, camera, limit }) => {
    const useDefaultDay = !earthDate && sol == undefined;

    const photos = await marsRoverService.getPhotos({
      rover,
      earthDate,
      sol: usesDefaultDay ? 1000 : sol,
      camera,
    });

    const limited = photos.slice(0, limit).map((photo) => ({
      id: photo.id,
      imgSrc: photo.img_src,
      earthDate: photo.earth_date,
      camera: photo.camera.full_name,
      rover: photo.rover.name,
    }));

    return { count: limited.length, photos: limited }
  },
});
