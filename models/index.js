const { sequelize } = require('./connection');
const Employee = require('./employee');
const Department = require('./department');

const db = {};
db.sequelize = sequelize;

// model 생성
db.Employee = Employee;
db.Department = Department;

// model init
Employee.init(sequelize);
Department.init(sequelize);

// 관계설정
Employee.associate(db);
Department.associate(db);

module.exports = db;
