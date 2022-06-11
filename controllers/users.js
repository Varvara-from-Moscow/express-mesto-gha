const User = require('../models/user');

const BAD_REQUEST_ERROR = 400;
const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: `Ошибка, некорректные данные при создании пользователя: ${err.message}` });
      }
      if (err.name === 'CastError') {
        return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, пользователи отсутствуют' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка, некорректные данные в запросe' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  const error = new Error('Пользователя по указанному _Id не найдено');
  error.name = 'InvalidId'
  User.findById(userId)
    .then((user) => {
      if(!user) throw error;
      res.send({ data:user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({message: 'Ошибка, некорректные данные в запросe'})
      }
      if (err.name === 'InvalidId') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, пользователь по указанному _Id не найден' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, пользователь по указанному  _Id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: `Ошибка, переданы некорректные данные при обновлении аватара: ${err.message}` });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: `Ошибка, переданы некорректные данные при обновлении аватара: ${err.message}` });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, пользователь по указанному  _Id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: `Ошибка, переданы некорректные данные при обновлении профиля:: ${err.message}` });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: `Введены некорректные данные: ${err.message}` });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка, попробуйте еще раз' });
    });
};