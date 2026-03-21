import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll);
router.post('/', userController.create);
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);
router.patch('/:id/role', userController.updateProfile); // Using updateProfile for role change too
router.delete('/:id', userController.delete);

export default router;