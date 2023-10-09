import { Router } from 'express';
import { getCards, createCard, deleteCard } from '../controllers/card';

const router = Router();
router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);

export default router;
