import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import {
  getCurrentUser,
  updateUserAvatar,
  updateUser, getUserById, getUsers,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
  }),
}), updateUser);

export default router;
