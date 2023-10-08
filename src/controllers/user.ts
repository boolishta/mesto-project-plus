import { Request, Response } from 'express';
import User from '../models/user';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send(user))
    .catch((error) => res.status(400).send(error));
};

export const getUsers = (req: Request, res: Response) => {
  User.find().then((users) => res.send({ users }));
};

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.find({ _id: userId }).then((user) => res.send({ user }));
};
