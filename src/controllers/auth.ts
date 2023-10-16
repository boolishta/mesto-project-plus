import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../errors/index';
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
