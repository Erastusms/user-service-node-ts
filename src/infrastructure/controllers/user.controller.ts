import { Request, Response } from 'express';
import { UserService } from '../../application/services/user.service';
import { logger } from '../../core/logger';

const service = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await service.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err: any) {
      logger.error(`Create user error: ${err.message}`);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const users = await service.getAllUsers();
    res.json({ success: true, data: users });
  }

  async findById(req: Request, res: Response) {
    try {
      const user = await service.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (err: any) {
      logger.error(`Find user error: ${err.message}`);
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await service.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (err: any) {
      logger.error(`Update user error: ${err.message}`);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.deleteUser(req.params.id);
      res.json({ success: true, message: 'User deleted' });
    } catch (err: any) {
      logger.error(`Delete user error: ${err.message}`);
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
