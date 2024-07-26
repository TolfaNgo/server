const pool = require("../../../database");
const moment = require("moment");
const { TolfaRescueType } = require("./model/rescue-type.model");
const { TolfaSpecies } = require("../species-type/model/species-type.model");
const TABLE_NAME = "tolfa_rescue_type";

exports.get = async (req, res) => {
  const statement = `SELECT 
  @row_number:=@row_number+1 AS serial_no,
  trt.id as id, 
  trt.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  trt.created_at as created_at,
  trt.updated_at as updated_at
  FROM tolfa_rescue_type as trt 
  INNER JOIN tolfa_user as tu on tu.id = trt.updated_by
  INNER JOIN tolfa_user as itu on itu.id = trt.created_by, (SELECT @row_number:=0) as rn
  WHERE trt.active = true
  ORDER BY trt.id`;

  pool.query(statement, (err, result, fileds) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          message: "rescue type data",
          status: 200,
          success: true,
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.create = async (req, res) => {
  try {
    let { body } = req;
    let { name, created_by } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
        ${created_by},
        ${created_by},
        '${moment().format("YYYY-MM-DD HH:mm:ss")}', 
        '${moment().format("YYYY-MM-DD HH:mm:ss")}'
        )`;

    pool.query(statement, (err, result, fileds) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        res.status(200).json({
          status: 200,
          message: "Rescue type added successfuly",
          success: true,
          data: result[0],
        });
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, name, created_by, updated_by, active } = req.body;

    // Ensure id is provided
    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "ID is required",
        success: false,
      });
    }

    // Find the record by ID
    const area = await TolfaRescueType.findByPk(id);

    if (!area) {
      return res.status(404).json({
        status: 404,
        message: "Record not found",
        success: false,
      });
    }

    // Update the record with new values
    const updatedTolfaSpecies = await TolfaRescueType.update(
      {
        name,
        created_by,
        updated_by,
        active,
      },
      { where: { id } }
    );

    res.status(200).json({
      status: 200,
      message: "Record updated successfully",
      success: true,
      data: updatedTolfaSpecies,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Oops, something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the record is being used in TolfaBlockNumber
    const speciesType = await TolfaSpecies.findAll({
      where: { rescue_type_id: id, active: 1 },
    });

    if (speciesType.length > 0) {
      return res.status(400).json({
        status: 400,
        message:
          "Cannot delete this area as it is being used in one or more tolfa species.",
        success: false,
      });
    }

    const result = await TolfaRescueType.update(
      { active: false },
      { where: { id } }
    );

    if (result[0] > 0) {
      res.status(200).json({
        status: 200,
        message: "Rescue type deactivated successfully",
        success: true,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Rescue type not found",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error deactivating rescue type:", error);
    res.status(500).json({
      message: "Oops, something went wrong",
      status: 500,
      success: false,
    });
  }
};
