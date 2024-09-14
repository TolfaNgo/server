const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaUserRole = rogerSequelize.define(
  "tolfa_user_role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tolfa_user", // Name of the related model
        key: "id", // Key in the related model
      },
      onUpdate: "CASCADE", // If a user id is updated, update it here as well
      onDelete: "CASCADE", // If a user is deleted, delete the associated records here as well
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tolfa_role", // Name of the related model
        key: "id", // Key in the related model
      },
      onUpdate: "CASCADE", // If a role id is updated, update it here as well
      onDelete: "CASCADE", // If a role is deleted, delete the associated records here as well
    },
  },
  {
    tableName: "tolfa_user_role",
    timestamps: false, // No created_at and updated_at columns for this table
  }
);

// Synchronize the model with the database
TolfaUserRole.sync({ alter: true })
  .then(() => {
    console.log("tolfa_user_role table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating tolfa_user_role table:", err);
  });

module.exports = { TolfaUserRole };
