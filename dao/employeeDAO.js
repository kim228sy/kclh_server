const { Sequelize, Op } = require('sequelize');
const { Employee } = require('../models/index');
const { update } = require('../models/employee');

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
  // 사번 최대값
  max() {
    return new Promise((resolve, reject) => {
      Employee.max('employee_num').then((max) => {
        resolve(max);
      });
    });
  },
  // 로그인
  selectUser(params) {
    console.log(`로그인 DAO : ${JSON.stringify(params)}`);
    return new Promise((resolve, reject) => {
      Employee.findOne({
        attributes: ['employee_num', 'employee_name', 'department', 'rank', 'phone', 'email', 'factory', 'admin_ok'],
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
        attributes: ['employee_num', 'employee_name', 'department', 'rank', 'phone', 'email', 'admin_ok'],
        where: { employee_num: data },
      }).then((selectOne) => {
        resolve(selectOne);
      })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 전체 직원 조회
  getEmployeeDataData() {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        attributes: ['employee_num', 'employee_name', 'department', 'rank', 'phone', 'email', 'admin_ok'],
      }).then((selectAll) => {
        resolve(selectAll);
      })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // 폰 중복 확인
  phoneCheck(data) {
    return new Promise((resolve, reject) => {
      Employee.findAndCountAll({
        attributes: ['phone'],
        where: { phone: data },
      }).then((selectOne) => {
        console.log(selectOne.count);
        resolve(selectOne.count);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  // 내 정보 업뎃
  myDataUpdate(data) {
    return new Promise((resolve, reject) => {
      Employee.update(
        { user_pwd: data.user_pwd, phone: data.phone, email: data.email },
        {
          where: {
            employee_num: data.employee_num,
          },
        },
      ).then(([updated]) => {
        console.log('수정 성공: ', updated);
        resolve({ updatedCount: updated });
      }).catch((err) => {
        console.log('수정 실패: ', err);
        reject(err);
      });
    });
  },
  // 관리자 사원 정보 수정
  adminUpdate(data) {
    return new Promise((resolve, reject) => {
      Employee.update(
        { department: data.department, rank: data.rank, admin_ok: data.admin_ok },
        {
          where: {
            employee_num: data.employee_num,
          },
        },
      ).then(([updated]) => {
        console.log('수정 성공: ', updated);
        resolve({ updatedCount: updated });
      }).catch((err) => {
        console.log('수정 실패: ', err);
        reject(err);
      });
    });
  },
};

module.exports = dao;
