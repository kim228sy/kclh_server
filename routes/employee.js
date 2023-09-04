const express = require('express');

const router = express.Router();
const employeeService = require('../service/employeeService');
const employeeDAO = require('../dao/employeeDAO');
const tokenUtil = require('../lib/tokenUtil');
const { isLoggedIn } = require('../lib/middleware');
// 직원 등록
router.post('/join', async (req, res) => {
  try {
    const data = {
      employee_name: req.body.employee_name,
      phone: req.body.phone,
      email: req.body.email,
      department: req.body.department,
      rank: req.body.rank,
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
      employee_num: req.body.userid,
      user_pwd: req.body.password,
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

    // eslint-disable-next-line prefer-destructuring
    const name = result.name;
    // 최종 응답
    res
      .cookie('jwt', token, { maxAge: 3600000 })
      .status(200)
      // eslint-disable-next-line object-shorthand
      .json({ success: true, token: token, name: name });
  } catch (err) {
    console.log(err.toString());
    if (!res.body) {
      console.log('sdfgsdff');
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
    myData = await employeeService.getMyData(req.body.loginid);
    console.log(`내정보 조회 :  ${JSON.stringify(myData)}`);
    res.status(200).json(myData);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
// 폰번호 변경

// 비번 변경
module.exports = router;
