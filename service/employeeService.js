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
  // 폰 중복 체크
  async phoneCheck(data) {
    let inserted = null;
    let yn = null;
    try {
      inserted = await employeeDAO.phoneCheck(data);
      if (inserted > 0) {
        yn = 'N';
      } else if (inserted === 0) {
        yn = 'Y';
      }
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    console.log(yn);
    return new Promise((resolve) => {
      resolve(yn);
    });
  },

  // 내 정보 업뎃
  async myDataUpdate(data) {
    let result = null;

    // 비번 암호화
    let hashPassword = null;
    try {
      hashPassword = await hashUtil.makePasswordHash(data.user_pwd);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    // 암호화 된거로 등록
    const newData = {
      ...data,
      user_pwd: hashPassword,
    };
    try {
      result = await employeeDAO.myDataUpdate(newData);
    } catch (err) {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  },
  // 관리자 사원 정보 수정
  async adminUpdate(data) {
    let result = null;
    try {
      result = await employeeDAO.adminUpdate(data);
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
