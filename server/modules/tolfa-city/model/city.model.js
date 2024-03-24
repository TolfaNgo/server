// Define the Sequelize model
const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaCity = rogerSequelize.define(
  "tolfa_city",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_id: {
      type: DataTypes.INTEGER,
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
    tableName: "tolfa_city",
    timestamps: true, // If you want Sequelize to manage timestamps automatically, set this to true
    createdAt: "created_at", // Map Sequelize's createdAt to your table's created_at column
    updatedAt: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
  }
);

// Method to update
TolfaCity.prototype.updateTolfaCity = async function (id, newData) {
  try {
    const tolfaCity = await TolfaCity.findByPk(id);
    if (!tolfaCity) {
      throw new Error("Tolfa City not found");
    }

    // Update fields
    tolfaCity.name = newData.name !== undefined ? newData.name : tolfaCity.name;
    tolfaCity.state_id =
      newData.state_id !== undefined ? newData.state_id : tolfaCity.state_id;
    tolfaCity.updated_by =
      newData.updated_by !== undefined
        ? newData.updated_by
        : tolfaCity.updated_by;
    tolfaCity.updated_at = new Date(); // Set updated_at to current date and time
    tolfaCity.active =
      newData.active !== undefined ? newData.active : tolfaCity.active;

    await tolfaCity.save();

    return tolfaCity;
  } catch (error) {
    throw error;
  }
};

module.exports = { TolfaCity };
