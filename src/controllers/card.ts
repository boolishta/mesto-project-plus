import { Request, Response } from 'express';
import { failFind, sendError } from '../errors/index';
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
    return sendError(error, res);
  }
};

const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await CardModel.find();
    return res.status(200).send(cards);
  } catch (error) {
    return sendError(error, res);
  }
};

const deleteCard = async (req: Request, res: Response) => {
  try {
    await CardModel.findByIdAndDelete(req.params.cardId).orFail(() => failFind('NoCardById'));
    return res.send({ message: 'Карточка удалена' });
  } catch (error) {
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
    ).orFail(() => failFind('NoCardById'));
    return res.status(200).send(card);
  } catch (error) {
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
    ).orFail(() => failFind('NoCardById'));
    return res.status(200).send(card);
  } catch (error) {
    return sendError(error, res);
  }
};

export {
  likeCard, dislikeCard, createCard, getCards, deleteCard,
};
