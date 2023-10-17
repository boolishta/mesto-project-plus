import { Router } from 'express';
import {
  updateUserAvatar,
  updateUser, getUser, getUsers,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);

export default router;
