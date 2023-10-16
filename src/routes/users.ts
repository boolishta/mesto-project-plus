import { Router } from 'express';
import {
  updateUserAvatar,
  updateUser, createUser, getUser, getUsers, login,
} from '../controllers/user';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);
router.post('/signin', login);

export default router;
