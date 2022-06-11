const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  req.user = {
    _id: '62a0f4be4605723094f23541'
  }
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('*', (_req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
