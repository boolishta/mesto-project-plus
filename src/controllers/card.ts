import { Request, Response } from 'express';
import CardModel from '../models/card';

export const createCard = (req: Request, res: Response) => {
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

export const getCards = (req: Request, res: Response) => {
  CardModel.find().then((cards) => res.send(cards));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  CardModel.deleteOne({ _id: cardId }).then(() => res.send({ message: 'Карточка удалена' }));
};
