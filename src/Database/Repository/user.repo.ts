import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../Entity/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const user = this.create({
      name,
      email,
      password: hashedPassword,
    });
    return await this.save(user);
  }
}
