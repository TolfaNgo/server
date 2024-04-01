const pool = require("../../../database");
const moment = require("moment");
const { TolfaBlockNumber } = require("./model/block-number.model");
const { decodeToken } = require("../../middleware/auth.middleware");
const TABLE_NAME = "tolfa_block_number";

const tolfaSpeciesInit = new TolfaBlockNumber();

exports.get = async (req, res) => {
  const statement = `SELECT 
  tbn.id as id, 
  tbn.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  tbn.created_at as created_at,
  tbn.updated_at as updated_at,
  ta.name as tolfa_area_name,
  ta.id as tolfa_area_id
  FROM tolfa_block_number as tbn 
  INNER JOIN tolfa_user as tu on tu.id = tbn.updated_by
  INNER JOIN tolfa_user as itu on itu.id = tbn.created_by 
  INNER JOIN tolfa_area as ta on ta.id = tbn.area_id`;

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
          message: "record found",
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
    let { name, created_by, area_id } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      area_id,
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
        ${area_id},
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
          message: "Record added successfuly",
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
    let { body } = req;
    let { name, id, updated_by, area_id } = body;

    const statement = `UPDATE ${TABLE_NAME} set 
    name = '${name}', 
    area_id = ${area_id}, 
    updated_by = ${updated_by},
    updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}' where id = ${id}`;

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
          message: "Record updated successfuly",
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

exports.delete = async (req, res) => {
  try {
    let { body } = req;
    let { id } = body;

    const statement = `UPDATE ${TABLE_NAME} set active = ${false} where id = ${id}`;

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
          message: "Record deleted successfuly",
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

/**
 * @migration - Sequelize
 */

// Controller function to update tolfaBlockDetail entry by ID
exports.updateById = async (req, res) => {
  try {
    const id = req.body.id; // Assuming ID is passed in the URL params
    let token = req.headers.auth_token;
    let userToken = await decodeToken(token);

    // Find the tolfaBlockDetail entry by ID
    let tolfaBlockDetail = await TolfaBlockNumber.findByPk(id);

    // If tolfaBlockDetail entry does not exist, return 404 Not Found
    if (!tolfaBlockDetail) {
      return res.status(404).json({ message: "tolfaBlockDetail not found" });
    }

    const payload = {
      ...req.body,
      id: id,
      area_id: req.body.area_id,
      name: req.body.name,
      updated_by: userToken.id,
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    // Update tolfaBlockDetail entry with the fields provided in the request body
    tolfaBlockDetail = await TolfaBlockNumber.update(payload, {
      where: { id: id }, // Specify the where clause to update by ID
    });

    // Send success response
    return res.status(200).json({
      message: "tolfaBlockDetail updated successfully",
      tolfaBlockDetail,
    });
  } catch (error) {
    console.error("Error updating tolfaBlockDetail:", error);
    // Send error response
    return res.status(500).json({ message: "Internal server error" });
  }
};
