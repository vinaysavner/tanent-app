'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tanents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tanents.init({
    user_id: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tanents',
  });
  return tanents;
};