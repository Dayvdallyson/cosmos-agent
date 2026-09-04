import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

import { apodTool, marsRoverPhotosTool } from '../tools/nasa-tools';

export const nasaAgent = new Agent({
  id: 'nasa-agent',
  name: 'NASA Agent',
  description:
  'An Assistant that answers questions about space using live NASA open APIs: the Astronomy Picture of the Day and Mars rover photos.',
  instructions: `You are a NASA space assistant with access to live NASA Open APIs
- use the APOD tool for "picture of the day" or astronomy image requests.
- use the Mars rover tool for photos taken on Mars. If the user does not give a rover, use Curiosity; if they give no date or sol, let the pool pick a default.
- Whenever you return an image, include its direct URL in plain text so the user can open it.
- Be concise and factual. If a tool returns no results, say so and suggest another date, sol, or camera.`,
  model: 'anthropic/claude-sonnet-5',
  memory: new Memory({
    options: {
      generateTitle: true,
    },
  }),
  tools: {
    get_apod: apodTool,
    get_mars_rover_photos: marsRoverPhotosTool,
  },
});
