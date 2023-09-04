const employeeDAO = require('../dao/employeeDAO');
const hashUtil = require('../lib/hashUtil');

const service = {
  // 직원 추가
  async add(data) {
    console.log(`직원추가 서비스 : ${JSON.stringify(data)}`);
    let inserted = null;
    const pwd = '000000';
    // 비번 암호화
    let hashPassword = null;
    try {
      hashPassword = await hashUtil.makePasswordHash(pwd);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    const newData = {
      ...data,
      user_pwd: hashPassword,
    };

    try {
      inserted = await employeeDAO.employeeAdd(newData);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    // 결과값 리턴
    return new Promise((resolve) => {
      resolve(inserted);
    });
  },
  // 로그인
  async login(data) {
    let user = null;
    try {
      user = await employeeDAO.selectUser(data);
      // 데이터 불일치
      if (!user) {
        const err = new Error('아이디 ,비번 확인');
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    // 비번 비교
    try {
      const checkPassword = await hashUtil.checkPasswordHash(
        data.user_pwd,
        user.user_pwd,
      );

      if (!checkPassword) {
        const err = new Error('비번 확인');

        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    } catch (err) {
      console.log(`비번에러 ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    return new Promise((resolve) => {
      resolve(user);
    });
  },
  // 내 정보
  async getMyData(data) {
    let result = null;
    console.log(`내 정보 서비스 : ${JSON.stringify(data)}`);
    try {
      result = await employeeDAO.getMyData(data);
      console.log(`내 정보 서비스 myDate result : ${result}`);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  },
};

module.exports = service;
