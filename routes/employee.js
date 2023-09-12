/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();
const employeeService = require('../service/employeeService');
const employeeDAO = require('../dao/employeeDAO');
const tokenUtil = require('../lib/tokenUtil');
const { isLoggedIn } = require('../lib/middleware');
// 직원 등록
router.post('/join', async (req, res) => {
  // 메일 자동생성 - 사번 최대값 가져오기
  const maxNum = await employeeDAO.max();
  try {
    let admin = null;
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let ymd = `${year}-${month}-${date}`;
    console.log(ymd);
    if (req.body.admin_ok === '관리자') {
      admin = 'Y';
    } else if (req.body.admin_ok === '사원') {
      admin = 'N';
    }
    const data = {
      employee_name: req.body.employee_name,
      phone: req.body.phone,
      email: `${maxNum + 1}@uvc.io`,
      department: req.body.department,
      rank: req.body.rank,
      factory: req.body.factory,
      admin_ok: admin,
      joinDate: ymd,
    };
    await employeeService.add(data);

    // 최종 응답
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
// 로그인
router.post('/login', async (req, res) => {
  try {
    const data = {
      employee_num: req.body.employee_num,
      user_pwd: req.body.user_pwd,
    };
    console.log(`로그인 데이터 ${JSON.stringify(data)}`);
    // 입력값 null
    if (!data.employee_num || !data.user_pwd) {
      const err = new Error('아이디 비번 확인');
      res.status(500).json({ err: err.toString() });
    }

    // id, pwd 체크
    const result = await employeeService.login(data);
    console.log(`id, pwd 체크 : ${result}`);
    // 토큰 생성
    const token = tokenUtil.makeToken(result);
    console.log(`로그인 토큰 : ${token}`);

    console.log(`qwer ${JSON.stringify(result)}`);
    // 최종 응답
    res
      .cookie('jwt', token, { maxAge: 3600000 })
      .status(200)
      // eslint-disable-next-line object-shorthand
      .json({ success: true, token: token, name: result });
  } catch (err) {
    console.log(err.toString());
    if (!res.body) {
      res.status(204).send('입력 정보를 확인 하세요.!');
      return;
      // express는 204상태코드에 대해 response body를 보여주지 않고 넘어간다
    }
    res.status(500).json({ err: err.toString() });
  }
});
// My Data
router.get('/myData?:id', /* isLoggedIn, */ async (req, res) => {
  let myData = null;
  try {
    myData = await employeeService.getMyData(req.body.employee_num);
    console.log(`내정보 조회 :  ${JSON.stringify(myData)}`);
    res.status(200).json(myData);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
// 전체직원 조회
router.get('/employeeAll', async (req, res) => {
  let employeeData = null;
  try {
    employeeData = await employeeDAO.getEmployeeDataData();
    console.log(`전체직원 조회 :  ${JSON.stringify(employeeData)}`);
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
// 폰 중복 확인
router.post('/phoneCheck', async (req, res) => {
  let result = null;

  const phoneDouble = await employeeService.phoneCheck(req.body.phone);

  if (phoneDouble !== 'N') {
    result = 'Y';
  } else if (phoneDouble === 'N') {
    result = 'N';
  }
  res.status(200).json(result);
});

// 내정보 수정
router.put('/update?:id', /* isLoggedIn, */ async (req, res) => {
  try {
    const myData = {
      employee_num: req.body.employee_num,
      user_pwd: req.body.user_pwd,
      phone: req.body.phone,
    };
    console.log(`내 정보 업뎃 : ${JSON.stringify(myData)}`);
    await employeeService.myDataUpdate(myData);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
// 관리자가 직원 정보 수정
router.put('/adminUpdate?:id', /* isLoggedIn, */ async (req, res) => {
  try {
    let admin = null;
    if (req.body.admin_ok === '관리자') {
      admin = 'Y';
    } else if (req.body.admin_ok === '사원') {
      admin = 'N';
    }
    const myData = {
      employee_num: req.body.employee_num,
      department: req.body.department,
      rank: req.body.rank,
      factory: req.body.factory,
      admin_ok: admin,
    };
    console.log(`관리자 정보 업뎃 : ${JSON.stringify(myData)}`);
    await employeeService.adminUpdate(myData);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
// 직원 퇴사 처리
router.put('/resignDate?:id', /* isLoggedIn, */ async (req, res) => {

});
module.exports = router;
