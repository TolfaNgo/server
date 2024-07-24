const pool = require("../../../database");
const moment = require("moment");
const { TolfaArea } = require("./model/tolfa-area.model");
const {
  TolfaBlockNumber,
} = require("../block-number/model/block-number.model");
const TABLE_NAME = "tolfa_area";

exports.get = async (req, res) => {
  const statement = `SELECT 
  @row_number:=@row_number+1 AS serial_no,
  ta.id as id, 
  ta.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  ta.created_at as created_at,
  ta.updated_at as updated_at
  FROM tolfa_area as ta 
  INNER JOIN tolfa_user as tu on tu.id = ta.updated_by
  INNER JOIN tolfa_user as itu on itu.id = ta.created_by, (SELECT @row_number:=0) as rn
  WHERE ta.active = true
  ORDER BY ta.id`;

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
          message: "Record found",
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
          message: "record added successfuly",
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
    const area = await TolfaArea.findByPk(id);

    if (!area) {
      return res.status(404).json({
        status: 404,
        message: "Record not found",
        success: false,
      });
    }

    // Update the record with new values
    const updatedArea = await area.update({
      name,
      created_by,
      updated_by,
      active,
    });

    res.status(200).json({
      status: 200,
      message: "Record updated successfully",
      success: true,
      data: updatedArea,
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

    // Ensure id is provided
    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "ID is required",
        success: false,
      });
    }

    // Find the record by ID
    const record = await TolfaArea.findByPk(id);

    if (!record) {
      return res.status(404).json({
        status: 404,
        message: "Record not found",
        success: false,
      });
    }

    // Check if the record is being used in TolfaBlockNumber
    const blockNumbers = await TolfaBlockNumber.findAll({
      where: { area_id: id, active: 1 },
    });

    if (blockNumbers.length > 0) {
      return res.status(400).json({
        status: 400,
        message:
          "Cannot delete this area as it is being used in one or more tolfa block numbers.",
        success: false,
      });
    }

    // Update the record to set active to false
    record.active = false;
    await record.save();

    res.status(200).json({
      status: 200,
      message: "Record deleted successfully",
      success: true,
      data: record,
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
