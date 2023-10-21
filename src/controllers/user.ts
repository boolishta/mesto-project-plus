import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import {
  NotValidError,
  errorHandler,
  ERROR_MESSAGE,
} from '../errors';
import UserModel from '../models/user';
import { NotFoundError } from '../errors/not-found';
import { DuplicateError } from '../errors/duplicate';
import { SECRET_KEY } from '../config';
import { SessionRequest } from '../middlewares/auth';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const getUserIdFromRequest = (req: SessionRequest) => {
  const currentUserId = (typeof req.user === 'string') ? req.user : req.user?._id;

  if (!currentUserId) {
    throw new NotFoundError(ERROR_MESSAGE.NoUserById);
  }

  return currentUserId;
};

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

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.find();
    return res.status(200).send(user);
  } catch (error) {
    next(error);
    return null;
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    return res.status(200).send(user);
  } catch (error) {
    next(error);
    return null;
  }
};

export const updateUser = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { name, about } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    return res.status(200).send(user);
  } catch (error) {
    next(error);
    return null;
  }
};

export const updateUserAvatar = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { avatar } = req.body;
    if (!validator.isURL(avatar)) {
      throw new NotValidError(ERROR_MESSAGE.NotValidUrl);
    }
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    return res.status(200).send(user);
  } catch (error) {
    next(error);
    return null;
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

export const getCurrentUser = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = getUserIdFromRequest(req);
    const user = await UserModel.findById(currentUserId).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    return res.status(200).send(user);
  } catch (error) {
    next(error);
    return null;
  }
};
