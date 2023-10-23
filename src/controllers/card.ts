import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden';
import { NotFoundError, ERROR_MESSAGE } from '../errors';
import { SessionRequest } from '../middlewares/auth';
import { getUserIdFromRequest } from './user';
import CardModel from '../models/card';

const createCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const userId = getUserIdFromRequest(req);
    const card = await CardModel.create({
      name,
      link,
      owner: userId,
    });
    return res.status(201).send(card);
  } catch (error) {
    next(error);
    return null;
  }
};

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardModel.find();
    return res.status(200).send(cards);
  } catch (error) {
    next(error);
    return null;
  }
};

const deleteCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const card = await CardModel.findById(req.params.cardId).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoCardById);
    });
    const userId = getUserIdFromRequest(req);
    if (userId !== card.owner.toString()) {
      throw new ForbiddenError(ERROR_MESSAGE.SomeoneElsesCard);
    }
    await card.remove();
    return res.status(200).send({ message: 'Карточка удалена' });
  } catch (error) {
    next(error);
    return null;
  }
};

const likeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    const card = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoCardById);
    });
    return res.status(200).send(card);
  } catch (error) {
    next(error);
    return null;
  }
};

const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    const card = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoCardById);
    });
    return res.status(200).send(card);
  } catch (error) {
    next(error);
    return null;
  }
};

export {
  likeCard, dislikeCard, createCard, getCards, deleteCard,
};
