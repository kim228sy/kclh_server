const Sequelize = require('sequelize');

module.exports = class Employee extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        employee_num: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        user_pwd: {
          type: Sequelize.STRING(255),
        },
        employee_name: {
          type: Sequelize.STRING(50),
        },
        department: {
          type: Sequelize.STRING(50),
        },
        rank: {
          type: Sequelize.STRING(50),
        },
        phone: {
          type: Sequelize.STRING(50),
        },
        email: {
          type: Sequelize.STRING(50),
        },
        factory: {
          type: Sequelize.STRING(50),
        },
        admin_ok: {
          type: Sequelize.CHAR,
        },
      },
      {
        sequelize,
        underscored: false,
        timestamps: false,
        paranoid: false,
      },
    );
  }

  static associate(db) {
    db.Employee.belongsTo(db.Department, { foreignKey: 'department_num' });
  }
};
