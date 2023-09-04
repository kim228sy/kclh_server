const express = require('express');

const router = express.Router();
const employeeRouter = require('./employee');
const departmentRouter = require('./department');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});
router.use('/employee', employeeRouter);
// router.use('/department', departmentRouter);

module.exports = router;
