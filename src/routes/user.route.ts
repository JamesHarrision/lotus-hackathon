// routes/user.routes.ts
import { Router } from 'express';
import { getAllUsers, createUser, changeUserRole, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.patch('/:id/role', changeUserRole);
router.delete('/:id', deleteUser);

export default router;