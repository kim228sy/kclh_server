/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
const { Sequelize, Op, INTEGER } = require("sequelize");
const { Iot } = require("../models/index");
const { PlcData } = require("../models/index");

const express = require('express');

const router = express.Router();

const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://192.168.0.106:1884');
const topic1 = 'edukit1'; // edukit1 1호기, dukit2 2호기
const topic2 = 'iot1/info'; // iot2/info

let one = [];
let two = [];
let three = [];
client.on('message', (topic, message) => {
  console.log(` 1호기 : ${one} \n 2호기 : ${two} \n 3호기 : ${three}`);
  // message -> 버퍼 객체, 버퍼는 이진 데이터를 나타내는 노드.js의 내장 클래스
  message = message.toString();
  let msgObj = JSON.parse(message); // 문자열을 JavaScript 객체로 파싱
//  console.log(msgObj);
  //plcData
  if (topic === topic1) {
    
    let tagObject1 = msgObj.plcdata.find(obj => obj.tagId === '1');   // 시작 true/false
    let tagObject15 = msgObj.plcdata.find(obj => obj.tagId === '15'); // 1호기 생산량
    let tagObject16 = msgObj.plcdata.find(obj => obj.tagId === '16'); // 2호기 생산량
    let tagObject17 = msgObj.plcdata.find(obj => obj.tagId === '17'); // 3호기 생산량 집어서 내려 놓으면 +1
    let tagObject36 = msgObj.plcdata.find(obj => obj.tagId === '36'); // 생산량 제한
    let tagObject38 = msgObj.plcdata.find(obj => obj.tagId === '38'); // 불량기준(주사위값)

    let tagValue1;
    let tagValue15;
    let tagValue16;
    let tagValue17;
    let tagValue36;
    let tagValue38;
    
    if(tagObject15 !== undefined || tagObject16 !== undefined || tagObject17 !== undefined) {
      tagValue1= tagObject1.value;
      tagValue15= tagObject15.value;
      tagValue16= tagObject16.value;
      tagValue17= tagObject17.value;
      console.log(`시작 : ${tagValue1}`);
      console.log(`1호기 생산량 : ${tagValue15}`);
      console.log(`2호기 생산량 : ${tagValue16}`);
      console.log(`3호기 생산량 : ${tagValue17}`);
    }
    
    
    // tagId == 1 true 일 때 데이터 배열에 넣기    
    if(new Boolean(tagObject1.value) == true){
      one.push(tagObject15.value);
      two.push(tagObject16.value);
      three.push(tagObject17.value);
      
    }
    //tagId == 1 false 일 때 배열 중복값 제거후 가장 큰값 디비에
    else if(new Boolean(tagObject1.value) == false){
      let result1 = [...new Set(one)]; // 중복제거
      let result2 = [...new Set(two)]; // 중복제거
      let result3 = [...new Set(three)]; // 중복제거
      console.log(`값 확인 : ${result1}`);
      //  최대값 구하기
      let maxValue1 = Math.max(...result1);
      let maxValue2 = Math.max(...result2);
      let maxValue3 = Math.max(...result3);
      console.log(`${maxValue1}   ${maxValue2}   ${maxValue3}`);
      // 현재 시간 
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let date = today.getDate();
      let hours = today.getHours(); 
      let minutes = today.getMinutes();  
      let seconds = today.getSeconds(); 
      let time = `${year}-${month}-${date} / ${hours}:${minutes}:${seconds}`;

      let dataPlc = {
        unit_one : maxValue1,
        unit_two : maxValue2,
        unit_three : maxValue3,
        time : time
      }
      // 최대값 디비 저장
      PlcData.create(dataPlc)
      .then((inserted) => {
        console.log("저장 성공");
        dataIot = null; // 데이터를 초기화
        one.splice(0, one.length);     //배열 초기화
        two.splice(0, two.length);     //배열 초기화
        three.splice(0, three.length); //배열 초기화
        console.log(`배열 초기화 확인 : ${one.length}`);
      })
      .catch((err) => {
        console.error(`저장 실패 : ${err}`);
      });
    }
  } else if (topic === topic2) { // IotData
    let tempObj= msgObj.iotdata.find(obj => obj.type === 'temp');
    let humidObj= msgObj.iotdata.find(obj => obj.type === 'humid');
    
    if(tempObj !== undefined && humidObj !== undefined){
      let tempValue= tempObj.value;
      let humidValue= humidObj.value;

      console.log(`Temp: ${tempValue}, Humid: ${humidValue}`);
      
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let date = today.getDate();
      let hours = today.getHours(); 
      let minutes = today.getMinutes();  
      let seconds = today.getSeconds(); 
      let time = `${year}-${month}-${date} / ${hours}:${minutes}:${seconds}`;

      dataIot ={
        temp : parseInt(tempValue),
        humid : parseInt(humidValue),
        time : time
      };

      
     }
   }
});
// 1분(60000밀리초)마다 실행되는 함수 - iot데이터
setInterval(() => {
  if (dataIot !== null) { 
    Iot.create(dataIot)
        .then((inserted) => {
          console.log("저장 성공");
          dataIot = null; // 데이터를 초기화
        })
        .catch((err) => {
          console.error(`저장 실패 : ${err}`);
        });
  }
}, 60000);



client.on('connect', () => {
  client.subscribe(topic1); 
  client.subscribe(topic2);  
});

module.exports = router;
