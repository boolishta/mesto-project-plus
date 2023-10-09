import { Request, Response } from 'express';
import UserModel from '../models/user';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  UserModel.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send(user))
    .catch((error) => res.status(400).send(error));
};

export const getUsers = (req: Request, res: Response) => {
  UserModel.find().then((users) => res.send(users));
};

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  UserModel.find({ _id: userId }).then((user) => res.send({ user }));
};
