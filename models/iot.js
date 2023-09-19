const Sequelize = require('sequelize');

module.exports = class Iot extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        temp: {
          type: Sequelize.STRING(50),

        },
        humid: {
          type: Sequelize.STRING(50),
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