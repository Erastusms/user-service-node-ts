import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { logger } from '../../core/logger';

export class UserService {
  private repo = new UserRepository();

  async createUser(data: UserEntity) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');

    const user = await this.repo.create(data);
    await this.repo.logAction(user.id, 'CREATE', 'User created');
    logger.info(`User created: ${user.email}`);
    return user;
  }

  async getAllUsers() {
    const users = await this.repo.findAll();
    logger.info(`Fetched ${users.length} users`);
    return users;
  }

  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUser(id: string, data: Partial<UserEntity>) {
    const updated = await this.repo.update(id, data);
    await this.repo.logAction(id, 'UPDATE', 'User updated');
    logger.info(`User updated: ${id}`);
    return updated;
  }

  async deleteUser(id: string) {
    await this.repo.delete(id);
    await this.repo.logAction(id, 'DELETE', 'User deleted');
    logger.info(`User deleted: ${id}`);
  }
}
