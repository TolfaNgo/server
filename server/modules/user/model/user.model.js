const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");
const { TolfaRole } = require("../../role/model/role.model"); // Ensure the path is correct

const TolfaUser = rogerSequelize.define(
  "tolfa_user",
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    tableName: "tolfa_user",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Synchronize the model with the database
TolfaUser.sync({ alter: true })
  .then(() => {
    console.log("TolfaUser table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating TolfaUser table:", err);
  });

module.exports = { TolfaUser };
