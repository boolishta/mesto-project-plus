import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ERROR_MESSAGE, failFindById, sendError } from '../errors/index';
import CardModel from '../models/card';

const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    // @ts-ignore
    const userId = req.user._id;
    const card = await CardModel.create({
      name,
      link,
      owner: userId,
    });
    return res.status(201).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ ...error, message: ERROR_MESSAGE.Validation });
    }
    return res.status(500).send({ message: ERROR_MESSAGE.Server, error });
  }
};

const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await CardModel.find();
    return res.status(200).send(cards);
  } catch (error) {
    return res.status(500).send({ message: ERROR_MESSAGE.Client, error });
  }
};

const deleteCard = async (req: Request, res: Response) => {
  try {
    await CardModel.findByIdAndDelete(req.params.cardId).orFail(() => failFindById('NoCardById'));
    return res.send({ message: 'Карточка удалена' });
  } catch (error: any) {
    return sendError(error, res);
  }
};

const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      // @ts-ignore
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => failFindById('NoCardById'));
    return res.status(200).send(card);
  } catch (error: any) {
    return sendError(error, res);
  }
};

const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await CardModel.findByIdAndUpdate(
      req.params.cardId,
      // @ts-ignore
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => failFindById('NoCardById'));
    return res.status(200).send(card);
  } catch (error: any) {
    return sendError(error, res);
  }
};

export {
  likeCard, dislikeCard, createCard, getCards, deleteCard,
};
