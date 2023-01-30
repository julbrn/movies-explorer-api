const STATUS_MESSAGE = {
  SERVER_ERROR_MESSAGE: 'Ошибка сервера',
  INCORRECT_DATA_MESSAGE: 'Переданы некорректные данные',
  NONEXISTENT_MOVIE_MESSAGE: 'Фильм с указанным id не найден.',
  NONEXISTENT_USER_MESSAGE: 'Такой пользователь не найден.',
  WRONG_LOGIN_DATA_MESSAGE: 'Неправильные почта или пароль.',
  WRONG_ID_MESSAGE: 'Передан некорректный id пользователя.',
  CONFLICT_MESSAGE: 'Пользователь с таким email уже существует.',
  PAGE_NOT_FOUND_MESSAGE: 'Запрашиваемый ресурс не найден.',
  UNAUTHORIZED_MOVIE_DELETION_MESSAGE: 'Запрашиваемый ресурс не найден.',
  UNAUTHORIZED_MESSAGE: 'Требуется авторизация',
  TOO_MANY_REQUESTS: 'С вашего IP-адреса отправляется слишком много запросов.'
};

module.exports = {
  STATUS_MESSAGE,
};