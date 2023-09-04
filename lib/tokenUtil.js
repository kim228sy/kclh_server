const jwt = require('jsonwebtoken');

const secretKey = '2B4D6251655468566D597133743677397A24432646294A404E635266556A586E';

const options = {
  expiresIn: '1000h', // 만료시간
};

const tokenUtil = {
  // 토큰 생성
  // jwt.sign({JWT 데이터}, 비밀키, { expiresIn: '7d' }7일 뒤에 만료);
  makeToken(user) {
    const payload = {
      userid: user.userid,
      loginid: user.loginid,
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
  },

  // access token 검증
  verifyToken(token) {
    console.log(`access token : ${token}`);
    try {
      const decoded = jwt.verify(token, secretKey);
      console.log(`access token 검증 : ${JSON.stringify(decoded)}`);
      return decoded;
    } catch (err) {
      console.log(`access token : ${err}`);
      // 유효기간이 만료
      return null;
    }
  },

};

module.exports = tokenUtil;
