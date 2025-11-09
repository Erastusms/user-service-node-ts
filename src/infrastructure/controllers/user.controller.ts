import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { UserService } from '../../application/services/user.service';
import { NotFoundError } from '../../middlewares/errorHandler';
import { successResponse } from '../../utils/responseHandler';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.createUser(req.body);
    return successResponse(
      res,
      'User created successfully',
      result,
      undefined,
      201
    );
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    return successResponse(res, 'User fetched successfully', user);
  });

  getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    return successResponse(res, 'Users fetched successfully', users);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.userService.updateUser(req.params.id, req.body);
    if (!updated) throw new NotFoundError('User not found');
    return successResponse(res, 'User updated successfully', updated);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    await this.userService.deleteUser(req.params.id);
    return successResponse(
      res,
      'User deleted successfully',
      null,
      undefined,
      204
    );
  });
}
