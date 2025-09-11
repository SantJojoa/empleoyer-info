'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SearchLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SearchLog.belongsTo(models.User, { foreignKey: 'userId' });
      SearchLog.belongsTo(models.Employee, { foreignKey: 'employeeId' });
    }
  }
  SearchLog.init({
    userId: DataTypes.INTEGER,
    employeeId: DataTypes.INTEGER,
    query: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SearchLog',
  });
  return SearchLog;
};