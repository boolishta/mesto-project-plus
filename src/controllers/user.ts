import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { failFind, sendError } from '../errors/index';
import UserModel from '../models/user';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel
      .findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (error) {
    return sendError(error, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await UserModel.create({
      name,
      about,
      avatar,
    });
    return res.status(200).send(user);
  } catch (error) {
    return sendError(error, res);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find();
    return res.status(200).send(user);
  } catch (error) {
    return sendError(error, res);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).orFail(() => failFind('NoUserById'));
    return res.status(200).send(user);
  } catch (error) {
    return sendError(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
  // @ts-ignore
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    ).orFail(() => failFind('NoUserById'));
    return res.status(200).send(user);
  } catch (error) {
    return sendError(error, res);
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    ).orFail(() => failFind('NoUserById'));
    return res.status(200).send(user);
  } catch (error) {
    return sendError(error, res);
  }
};
