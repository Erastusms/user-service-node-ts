import { prisma } from '../../core/database';
import { UserEntity } from '../entities/user.entity';

export class UserRepository {
  async create(data: UserEntity) {
    return prisma.user.create({ data });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: Partial<UserEntity>) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async logAction(userId: string, action: string, message?: string) {
    return prisma.userLog.create({ data: { userId, action, message } });
  }
}
