const Sequelize = require('sequelize');

module.exports = class Department extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {

        department_num: {
          type: Sequelize.STRING(50),
          primaryKey: true,
        },

        department: {
          type: Sequelize.STRING(50),
        },
        people: {
          type: Sequelize.BIGINT,
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
    db.Department.hasMany(db.Employee, { foreignKey: 'department_num' });
  }
};
