export type StatusCode = 404 | 401 | 409 | 400 | 403

export interface StatusCodeError extends Error {
  statusCode: StatusCode
}

export const ERROR_MESSAGE = {
  Server: 'На сервере произошла ошибка.',
  NoCardById: 'Нет карточки по заданному id',
  NoUserById: 'Нет пользователя по заданному id',
  IncorrectEmailOrPassword: 'Неправильные почта или пароль',
  AuthorizationRequired: 'Необходима авторизация',
  DuplicateEmail: 'Пользователь с таким email существует',
  NotValidUrl: 'Не верный формат URL',
  NotValidEmail: 'Неправильный формат почты',
  SomeoneElsesCard: 'Чужая карточка',
  PageNotFound: 'Страница не найдена',
};
