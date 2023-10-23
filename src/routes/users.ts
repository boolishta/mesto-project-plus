import { celebrate } from 'celebrate';
import { Router } from 'express';
import { VALIDATION_OPTIONS } from '../validation';
import { SessionRequest } from '../middlewares/auth';
import {
  getCurrentUser,
  updateUserAvatar,
  updateUser, getUserById, getUsers,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', (req, res, next) => getCurrentUser(req as SessionRequest, res, next));
router.get(
  '/:userId',
  celebrate(VALIDATION_OPTIONS.USER_ID),
  getUserById,
);
router.patch('/me/avatar', celebrate(VALIDATION_OPTIONS.AVATAR), (req, res, next) => updateUserAvatar(req as SessionRequest, res, next));
router.patch('/me', celebrate(VALIDATION_OPTIONS.CURRENT_USER), (req, res, next) => updateUser(req as SessionRequest, res, next));

export default router;
