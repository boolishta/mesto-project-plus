import { Segments, Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import { URL_PATTERN } from '../consts';
import { SessionRequest } from '../middlewares/auth';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';

const router = Router();
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(URL_PATTERN),
  }),
}), (req, res, next) => createCard(req as SessionRequest, res, next));
router.get('/', getCards);
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().required(),
  },
}), (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  deleteCard(sessionReq, res, next);
});
router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().required(),
  },
}), (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  dislikeCard(sessionReq, res, next);
});
router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().required(),
  },
}), (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  likeCard(sessionReq, res, next);
});

export default router;
