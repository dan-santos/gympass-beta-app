import { Checkin, Prisma } from '@prisma/client';
import { ICheckInsRepository } from '../checkins-repository';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput){
    const checkIn = await prisma.checkin.create({
      data,
    });

    return checkIn;
  }

  async save(checkIn: Checkin){
    const updatedCheckIn = await prisma.checkin.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });

    return updatedCheckIn;
  }

  async findByUserIdOnDate(userId: string, date: Date){
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findById(checkInId: string){
    const checkIn = await prisma.checkin.findUnique({
      where: {
        id: checkInId
      },
    });

    return checkIn;
  }
  async findManyByUserId(userId: string, page: number){
    const checkIns = await prisma.checkin.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }

  async countByUserId(userId: string){
    const count = await prisma.checkin.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }
  
}