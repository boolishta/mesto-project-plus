import { Request, Response } from 'express';
import CardModel from '../models/card';

const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  // @ts-ignore
  const userId = req.user._id;
  CardModel.create({
    name,
    link,
    owner: userId,
  })
    .then((card) => res.send(card))
    .catch((error) => res.status(400).send(error));
};

const getCards = (req: Request, res: Response) => CardModel.find().then((cards) => res.send(cards));

const deleteCard = (req: Request, res: Response) => CardModel.findByIdAndDelete(req.params.cardId).then(() => res.send({ message: 'Карточка удалена' }));

const likeCard = (req: Request, res: Response) => CardModel.findByIdAndUpdate(
  req.params.cardId,
  // @ts-ignore
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => res.send(card));

const dislikeCard = (req: Request, res: Response) => CardModel.findByIdAndUpdate(
  req.params.cardId,
  // @ts-ignore
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => res.send(card));

export {
  likeCard, dislikeCard, createCard, getCards, deleteCard,
};
