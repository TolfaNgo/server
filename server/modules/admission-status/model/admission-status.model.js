const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaAdmissionStatus = rogerSequelize.define(
  "tolfa_admission_status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type_of_rescue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    species_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rescue_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rescue_by_tolfa: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    animal_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    main_color_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    second_color_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    thirdcolor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_features: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    breed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    animal_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tolfa_admission_status",
    timestamps: false, // We are managing created_at manually
  }
);

module.exports = { TolfaAdmissionStatus };
