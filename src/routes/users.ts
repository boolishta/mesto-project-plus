import { Router } from 'express';
import { createUser, getUser, getUsers } from '../controllers/user';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);

export default router;
