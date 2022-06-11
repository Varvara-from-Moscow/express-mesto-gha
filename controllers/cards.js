const Card = require('../models/card');

const BAD_REQUEST_ERROR = 400;
const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, карточки отсутствуют' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка, некорректные данные в запросе' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка, некорректные данные в запросе' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardsId } = req.params;

  Card.findByIdAndRemove(cardsId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка, некорректные данные в запросе' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, карточка не найдена' });
    }
    return res.send({ data: card });
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка, некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка, карточка не найдена' });
    }
    return res.send({ data: card });
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка, некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};
