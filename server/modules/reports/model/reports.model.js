const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const sequelize = rogerSequelize;

// Main animal status table
const RescueAnimalStatus = sequelize.define(
  "tolfa_rescue_animal_status",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    rescue_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    abc_status: DataTypes.INTEGER,
    tattoo_number: DataTypes.STRING,
    condition_value: DataTypes.INTEGER,
    body_score: DataTypes.INTEGER,
    caregiver_name: DataTypes.STRING,
    caregiver_number: DataTypes.BIGINT,
    problem: DataTypes.STRING,
    problem_type: DataTypes.TEXT,
    symptoms: DataTypes.TEXT,
    injury_location: DataTypes.TEXT,
    alt_problem: DataTypes.STRING,
    alt_problem_type: DataTypes.TEXT,
    alt_symptoms: DataTypes.TEXT,
    alt_injury_location: DataTypes.TEXT,
    cause_of_problem: DataTypes.TEXT,
    rassi_no: DataTypes.STRING,
    is_latest: DataTypes.TINYINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    timestamps: false,
    tableName: "tolfa_rescue_animal_status", // Explicit table name to avoid pluralization
  }
);

// Lookup tables
const ABCStatus = sequelize.define(
  "tolfa_abc_status",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
  },
  { timestamps: false, tableName: "tolfa_abc_status" }
);

const Status = sequelize.define(
  "tolfa_status",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
  },
  { timestamps: false, tableName: "tolfa_status" }
);

const Condition = sequelize.define(
  "tolfa_condition",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
  },
  { timestamps: false, tableName: "tolfa_condition" }
);

const BodyScore = sequelize.define(
  "tolfa_body_score",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
  },
  { timestamps: false, tableName: "tolfa_body_score" }
);

// Define Associations
RescueAnimalStatus.belongsTo(ABCStatus, {
  foreignKey: "abc_status",
  as: "abcStatus",
});

RescueAnimalStatus.belongsTo(Status, {
  foreignKey: "status_id",
  as: "status",
});

RescueAnimalStatus.belongsTo(Condition, {
  foreignKey: "condition_value",
  as: "condition",
});

RescueAnimalStatus.belongsTo(BodyScore, {
  foreignKey: "body_score",
  as: "bodyScore",
});

// Export models
module.exports = {
  RescueAnimalStatus,
  ABCStatus,
  Status,
  Condition,
  BodyScore,
};
