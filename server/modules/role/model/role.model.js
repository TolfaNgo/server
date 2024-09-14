const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaRole = rogerSequelize.define(
  "tolfa_role",
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at", // Map Sequelize's createdAt to your table's created_at column
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "tolfa_role",
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
    createdAt: "created_at", // Map Sequelize's createdAt to your table's created_at column
    updatedAt: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
  }
);

// Synchronize the model with the database
TolfaRole.sync({ alter: true })
  .then(() => {
    console.log("tolfa_role table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating tolfa_role table:", err);
  });

module.exports = { TolfaRole };
