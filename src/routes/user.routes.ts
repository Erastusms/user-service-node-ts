import { Router } from 'express';
import { UserController } from '../infrastructure/controllers/user.controller';
import { UserService } from '../application/services/user.service';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createUserSchema,
  updateUserSchema,
} from '../validators/user.validator';

const router = Router();
const userService = new UserService();
const controller = new UserController(userService);

router.post('/', validateRequest(createUserSchema), controller.createUser);
router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', validateRequest(updateUserSchema), controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;
