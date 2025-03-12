import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OverpassService {
  constructor(private readonly configService: ConfigService) {}

  async getNearbyAttractions(lat: number, lng: number): Promise<any> {
    const OVERPASS_API_URL = this.configService.get<string>('OVERPASS_API_URL');
    const OVERPASS_RADIUS = this.configService.get<number>('OVERPASS_RADIUS');

    const query = `
      [out:json];
      (
        way["tourism"="attraction"](around:${OVERPASS_RADIUS},${lat},${lng});
        relation["tourism"="attraction"](around:${OVERPASS_RADIUS},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await axios.post(OVERPASS_API_URL as string, query, {
        headers: { 'Content-Type': 'text/plain' },
      });
      return response.data.elements;
    } catch (error) {
      console.error('Error fetching data from Overpass API:', error);
      throw new Error('Failed to fetch data from Overpass API');
    }
  }
}
