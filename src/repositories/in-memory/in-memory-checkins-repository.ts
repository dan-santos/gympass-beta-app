import { Prisma, Checkin } from '@prisma/client';
import { ICheckInsRepository } from '../checkins-repository';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: Checkin[] = [];
  
  async findManyByUserId(userId: string, page: number){
    const ITEMS_PER_PAGE = 20;

    return this.checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page-1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }

  async findById(checkInId: string){
    const checkIn = this.checkIns
      .find(checkIn => checkIn.id === checkInId);

    if (!checkIn) return null;
    return checkIn;
  }
  
  async findByUserIdOnDate(userId: string, date: Date){
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkinOnSameDate = this.checkIns.find(
      (checkin) => {
        const checkInDate = dayjs(checkin.created_at);
        const isOnSameDate = 
          checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

        return checkin.user_id === userId && isOnSameDate;
      }
    );

    if (!checkinOnSameDate) {
      return null;
    }
    return checkinOnSameDate;
  }

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date()
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }

  async countByUserId(userId: string){
    const checkIns = this.checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .length;

    return checkIns;
  }

  async save(checkIn: Checkin) {
    const checkInIndex = this.checkIns
      .findIndex(item => checkIn.id === item.id);

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}