import { Segments, Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import { SessionRequest } from '../middlewares/auth';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';

const router = Router();
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    link: Joi.string().required(),
  }),
}), (req, res, next) => createCard(req as SessionRequest, res, next));
router.get('/', getCards);
router.delete('/:cardId', (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  deleteCard(sessionReq, res, next);
});
router.delete('/:cardId/likes', (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  dislikeCard(sessionReq, res, next);
});
router.put('/:cardId/likes', (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  likeCard(sessionReq, res, next);
});

export default router;
