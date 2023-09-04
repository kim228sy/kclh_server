/* eslint-disable import/no-extraneous-dependencies */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const corsConfig = require('./config/corsConfig.json');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/employee');
const models = require('./models/index');

dotenv.config();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// DB 연결 확인 및 table 생성
// console.log('models', models);
models.sequelize
  .authenticate()
  .then(() => {
    console.log('DB connection success');

    // sequelize sync (table 생성)
    models.sequelize
      .sync()
      .then(() => {
        console.log('Sequelize sync success');
      })
      .catch((err) => {
        console.log('Sequelize sync error', err);
      });
  })
  .catch((err) => {
    console.log('DB Connection fail', err);
  });

app.use(logger('dev'));
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
