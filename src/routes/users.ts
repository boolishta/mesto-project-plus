import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { SessionRequest } from '../middlewares/auth';
import {
  getCurrentUser,
  updateUserAvatar,
  updateUser, getUserById, getUsers,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', (req, res, next) => getCurrentUser(req as SessionRequest, res, next));
router.get('/:userId', getUserById);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), (req, res, next) => updateUserAvatar(req as SessionRequest, res, next));
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
  }),
}), (req, res, next) => updateUser(req as SessionRequest, res, next));

export default router;
