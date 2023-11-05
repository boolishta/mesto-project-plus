import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { InternalServerError } from '../errors/internal-server';
import {
  ERROR_MESSAGE,
  DuplicateError,
  BadRequestError,
} from '../errors';
import UserModel from '../models/user';
import { NotFoundError } from '../errors/not-found';
import { SECRET_KEY } from '../config';
import { SessionRequest } from '../middlewares/auth';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await UserModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    });
    res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      password: user.password,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      next(new DuplicateError(ERROR_MESSAGE.DuplicateEmail));
    } else if (error.code === 500) {
      next(new InternalServerError(ERROR_MESSAGE.Server));
    } else if (error.code === 400) {
      next(new BadRequestError(ERROR_MESSAGE.IncorrectDataTransmitted));
    } else {
      next(error);
    }
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    res.status(200).send(user);
  } catch (error: any) {
    if (error.code === 400) {
      next(new BadRequestError(ERROR_MESSAGE.IncorrectDataTransmitted));
    } else {
      next(error);
    }
  }
};

export const updateUserAvatar = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError(ERROR_MESSAGE.NoUserById);
    });
    res.status(200).send(user);
  } catch (error: any) {
    if (error.code === 400) {
      next(new BadRequestError(ERROR_MESSAGE.IncorrectDataTransmitted));
    } else {
      next(error);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel
      .findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      SECRET_KEY,
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: SEVEN_DAYS,
    });
    res.status(200).send({ message: 'Вход успешен' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserModel
      .findById(req.user._id)
      .orFail(() => {
        throw new NotFoundError(ERROR_MESSAGE.NoUserById);
      });
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
