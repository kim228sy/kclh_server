const { sequelize } = require("./connection");
const Employee = require("./employee");
const Department = require("./department");
// const Iot = require('./iot')
// const PlcData = require('./plcData');
const db = {};
db.sequelize = sequelize;

// model 생성
db.Employee = Employee;
db.Department = Department;
// db.Iot = Iot;
// db.PlcData = PlcData;

// model init
Employee.init(sequelize);
Department.init(sequelize);
// Iot.init(sequelize);
// PlcData.init(sequelize);

// 관계설정
Employee.associate(db);
Department.associate(db);

module.exports = db;
