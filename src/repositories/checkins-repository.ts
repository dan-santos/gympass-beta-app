import { Prisma, Checkin } from '@prisma/client';

export interface ICheckInsRepository {
  // we use "UncheckedInput" because gym and user is already created
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  save(checkIn: Checkin): Promise<Checkin | null>;
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>;
  findById(checkInId: string): Promise<Checkin | null>;
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
  countByUserId(userId: string): Promise<number>;
}