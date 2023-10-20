import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  errorHandler, ERROR_MESSAGE, failFind, sendError,
} from '../errors/index';
import { DuplicateError } from '../errors/duplicate';
import { SECRET_KEY } from '../config';
import { SessionRequest } from '../middlewares/auth';
import UserModel from '../models/user';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const user = await UserModel.create({
      name,
      about,
      avatar,
      email,
      password: await bcrypt.hash(password, 10),
    });
    return res.status(200).send(user);
  } catch (error: any) {
    if (error.code === 11000) {
      return errorHandler(
        new DuplicateError(ERROR_MESSAGE.DuplicateEmail),
        req,
        res,
      );
    }
    next(error);
    return null;
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel
      .findUserByCredentials(email, password);
    if (SECRET_KEY) {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: SEVEN_DAYS,
      });
    }
    return res.status(200).send({ message: 'Вход успешен' });
  } catch (error) {
    next(error);
    return null;
  }
};

export const getCurrentUser = async (req: SessionRequest, res: Response) => {
  const userId = (req.user as any); // Используйте _id текущего пользователя из JWT
  console.log(req.user);
  res.send({ userId });
};
