import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // expiration time: 1hr
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  public getCacheKey(lat: number, lng: number): string {
    return `landmarks:${lat}:${lng}`;
  }
}
