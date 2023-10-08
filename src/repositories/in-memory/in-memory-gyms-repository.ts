import { randomUUID } from 'node:crypto';
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository';
import { Gym, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Gym[] = [];

  async findById(gymId: string){
    const gym = this.gyms.find((gym) => gym.id === gymId);

    if (!gym) return null;
    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date()
    };

    this.gyms.push(gym);
    return gym;
  }

  async searchMany(query: string, page: number){
    const ITEMS_PER_PAGE = 20;
    return this.gyms
      .filter((gym) => gym.name.includes(query))
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }

  async findManyNearby(params: FindManyNearbyParams){
    const NEARBY_DISTANCE_IN_KILOMETERS = 10;

    return this.gyms.filter(gym => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
      );
      
      return distance < NEARBY_DISTANCE_IN_KILOMETERS;
    });
  }
}