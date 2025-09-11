'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Payment.init({
    userId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};