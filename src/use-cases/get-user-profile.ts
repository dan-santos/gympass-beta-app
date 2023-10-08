import { IUsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { ResourceNotFoundError } from './errors/common';

interface GetUserProfileUseCaseDto {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(
    private usersRepository: IUsersRepository,
  ){}

  async execute({ userId }: GetUserProfileUseCaseDto): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    return {
      user,
    };
  }
}