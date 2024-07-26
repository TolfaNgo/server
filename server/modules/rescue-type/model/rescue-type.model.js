// Define the Sequelize model
const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaRescueType = rogerSequelize.define(
  "tolfa_rescue_type",
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
    tableName: "tolfa_rescue_type",
    timestamps: true, // If you want Sequelize to manage timestamps automatically, set this to true
    createdAt: "created_at", // Map Sequelize's createdAt to your table's created_at column
    updatedAt: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
  }
);

// Method to update
TolfaRescueType.prototype.updateTolfaRescueType = async function (id, newData) {
  try {
    const tolfaRT = await TolfaRescueType.findByPk(id);
    if (!tolfaRT) {
      throw new Error("Tolfa species not found");
    }

    // Update fields
    tolfaRT.name = newData.name !== undefined ? newData.name : tolfaRT.name;
    tolfaRT.created_by = tolfaRT.created_by;
    tolfaRT.updated_by =
      newData.updated_by !== undefined
        ? newData.updated_by
        : tolfaRT.updated_by;
    tolfaRT.created_at = tolfaRT.created_at;
    tolfaRT.updated_at =
      newData.updated_at !== undefined
        ? newData.updated_at
        : tolfaRT.updated_at;
    tolfaRT.active =
      newData.active !== undefined ? newData.active : tolfaRT.active;

    await tolfaRT.save();

    return tolfaRT;
  } catch (error) {
    throw error;
  }
};

module.exports = { TolfaRescueType };
