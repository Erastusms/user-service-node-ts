import { Router } from 'express';
import { UserController } from '../infrastructure/controllers/user.controller';
import { UserService } from '../application/services/user.service';

const router = Router();
const userService = new UserService();
const controller = new UserController(userService);

router.post('/', controller.createUser);
router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;
