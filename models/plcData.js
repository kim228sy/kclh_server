const Sequelize = require('sequelize');

module.exports = class PlcData extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        unit_one: {
          type: Sequelize.STRING(50),
        },
        unit_two: {
          type: Sequelize.STRING(50),
        },
        unit_three: {
          type: Sequelize.STRING(50),
        },
        defect: {
          type: Sequelize.INTEGER,
        },
        amount_limit: {
          type: Sequelize.INTEGER,
        },
        time: {
          type: Sequelize.STRING(50),
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

};