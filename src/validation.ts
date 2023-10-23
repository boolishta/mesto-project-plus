import { Segments, Joi } from 'celebrate';

export const URL_PATTERN = /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/;

export const VALIDATION_OPTIONS = {
  SIGNIN: {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  SIGNUP: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().required().pattern(URL_PATTERN),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  USER_ID: {
    [Segments.PARAMS]: {
      userId: Joi.string().required(),
    },
  },
  AVATAR: {
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().required().pattern(URL_PATTERN),
    }),
  },
  CURRENT_USER: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  },
  CREATE_CARD: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().pattern(URL_PATTERN),
    }),
  },
  DELETE_CARD: {
    [Segments.PARAMS]: {
      cardId: Joi.string().required(),
    },
  },
  DISLIKE_CARD: {
    [Segments.PARAMS]: {
      cardId: Joi.string().required(),
    },
  },
  LIKE_CARD: {
    [Segments.PARAMS]: {
      cardId: Joi.string().required(),
    },
  },
};
