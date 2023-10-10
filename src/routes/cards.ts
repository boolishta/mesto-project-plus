import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';

const router = Router();
router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', dislikeCard);
router.put('/:cardId/likes', likeCard);

export default router;
