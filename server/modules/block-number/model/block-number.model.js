// Define the Sequelize model
const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaBlockNumber = rogerSequelize.define(
  "tolfa_block_number",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default value to current date and time
      field: "created_at", // Map Sequelize's createdAt to your table's created_at column
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default value to current date and time
      field: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "tolfa_block_number",
    timestamps: true, // If you want Sequelize to manage timestamps automatically, set this to true
    createdAt: "created_at", // Map Sequelize's createdAt to your table's created_at column
    updatedAt: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
  }
);

module.exports = { TolfaBlockNumber };
