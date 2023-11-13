import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden';
import { NotFoundError, ERROR_MESSAGE } from '../errors';
import { SessionRequest } from '../middlewares/auth';
import CardModel from '../models/card';

const createCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = await CardModel.create({
      name,
      link,
      owner: req.user._id,
    });
    res.status(201).send(card);
  } catch (error) {
    next(error);
  }
};

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardModel.find();
    res.status(200).send(cards);
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const card = await CardModel
      .findById(req.params.cardId)
      .orFail(() => {
        throw new NotFoundError(ERROR_MESSAGE.NoCardById);
      });
    if (req.user._id !== card.owner.toString()) {
      throw new ForbiddenError(ERROR_MESSAGE.SomeoneElsesCard);
    }
    await card.remove();
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (error) {
    next(error);
  }
};

const likeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const card = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoCardById);
    });
    res.status(200).send(card);
  } catch (error) {
    next(error);
  }
};

const dislikeCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const card = await CardModel
      .findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      ).orFail(() => {
        throw new NotFoundError(ERROR_MESSAGE.NoCardById);
      });
    res.status(200).send(card);
  } catch (error) {
    next(error);
  }
};

export {
  likeCard, dislikeCard, createCard, getCards, deleteCard,
};
