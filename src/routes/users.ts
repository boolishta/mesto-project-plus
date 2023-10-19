import { Router } from 'express';
import {
  getCurrentUser,
  updateUserAvatar,
  updateUser, getUser, getUsers,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);

export default router;
