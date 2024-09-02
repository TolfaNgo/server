const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaColor = rogerSequelize.define(
  "tolfa_color",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    color_type: {
      type: DataTypes.STRING,
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
    tableName: "tolfa_color",
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
    createdAt: "created_at", // Map Sequelize's createdAt to your table's created_at column
    updatedAt: "updated_at", // Map Sequelize's updatedAt to your table's updated_at column
  }
);

// Synchronize the model with the database
TolfaColor.sync({ alter: true })
  .then(() => {
    console.log("TolfaColor table created successfully.");
  })
  .catch((err) => {
    console.error("Error creating TolfaColor table:", err);
  });

module.exports = { TolfaColor };
