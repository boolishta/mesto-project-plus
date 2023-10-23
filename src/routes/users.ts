import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { URL_PATTERN } from '../consts';
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
  celebrate({
    [Segments.PARAMS]: {
      userId: Joi.string().required(),
    },
  }),
  getUserById,
);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_PATTERN),
  }),
}), (req, res, next) => updateUserAvatar(req as SessionRequest, res, next));
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), (req, res, next) => updateUser(req as SessionRequest, res, next));

export default router;
