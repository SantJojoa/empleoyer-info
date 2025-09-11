'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Report.belongsTo(models.User, { foreignKey: 'userId' });
      Report.belongsTo(models.Employee, { foreignKey: 'employeeId' });
    }
  }
  Report.init({
    userId: DataTypes.INTEGER,
    employeeId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    incidentDate: DataTypes.DATE,
    city: DataTypes.STRING,
    evidenceUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};