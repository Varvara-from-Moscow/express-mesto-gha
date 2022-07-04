const jwt = require('jsonwebtoken');

const JWT_SECRET = 'SECRET';

const auth = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    next(res.status(403).send({ error: 'Авторизация не успешна' }));
  } else {
    const token = cookies.jwt;
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(res.status(403).send({ error: 'jwt token невалидный' }));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
