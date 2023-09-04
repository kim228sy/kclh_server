const { Sequelize, Op } = require('sequelize');
const { Employee } = require('../models/index');

const dao = {
  // 직원추가
  employeeAdd(data) {
    console.log(`사원추가DAO : ${JSON.stringify(data)}`);
    return new Promise((resolve, reject) => {
      Employee.create(data).then((inserted) => {
        resolve(inserted);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // 로그인
  selectUser(params) {
    console.log(`로그인 DAO : ${JSON.stringify(params)}`);
    return new Promise((resolve, reject) => {
      Employee.findOne({
        attributes: ['employee_num', 'employee_name', 'department', 'user_pwd', 'rank', 'phone', 'email'],
        where: {
          employee_num: params.employee_num,
        },
      })
        .then((selectOne) => {
          console.log(`로그인 DAO${JSON.stringify(selectOne)}`);
          resolve(selectOne);
        })
        .catch((err) => {
          console.log(`로그인 DAO err : ${err}`);

          reject(err);
        });
    });
  },
  // 내 정보
  getMyData(data) {
    return new Promise((resolve, reject) => {
      Employee.findOne({
        attributes: ['employee_num', 'employee_name', 'department', 'rank', 'phone', 'email'],
        where: { employee_num: data },
      }).then((selectOne) => {
        resolve(selectOne);
      })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = dao;
