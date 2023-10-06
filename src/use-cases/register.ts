import { IUsersRepository } from '@/repositories/users-repository-interface';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user';

interface registerUseCaseDto {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: IUsersRepository,
  ){}

  async execute({ name, email, password }: registerUseCaseDto) {
    const password_hash = await hash(password, 6);
  
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
  
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
  
    await this.usersRepository.create({ name, email, password_hash });
  }
}

