import { celebrate } from 'celebrate';
import { Router } from 'express';
import { VALIDATION_OPTIONS } from '../validation';
import { SessionRequest } from '../middlewares/auth';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';

const router = Router();
router.post('/', celebrate(VALIDATION_OPTIONS.CREATE_CARD), (req, res, next) => createCard(req as SessionRequest, res, next));
router.get('/', getCards);
router.delete('/:cardId', celebrate(VALIDATION_OPTIONS.DELETE_CARD), (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  deleteCard(sessionReq, res, next);
});
router.delete('/:cardId/likes', celebrate(VALIDATION_OPTIONS.DISLIKE_CARD), (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  dislikeCard(sessionReq, res, next);
});
router.put('/:cardId/likes', celebrate(VALIDATION_OPTIONS.LIKE_CARD), (req, res, next) => {
  const sessionReq = req as unknown as SessionRequest;
  likeCard(sessionReq, res, next);
});

export default router;
