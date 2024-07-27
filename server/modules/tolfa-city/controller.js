const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_city";
const { TolfaCity } = require("./model/city.model");
const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaCityArea } = require("../city-area/model/city-area.model");

const tolfaCityInit = new TolfaCity();

exports.get = async (req, res) => {
  const statement = `SELECT 
  tc.id as id, 
  tc.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  tc.created_at as created_at,
  tc.updated_at as updated_at,
  ts.name as state_name,
  ts.id as state_id
  FROM tolfa_city as tc 
  INNER JOIN tolfa_user as tu on tu.id = tc.updated_by
  INNER JOIN tolfa_user as itu on itu.id = tc.created_by 
  INNER JOIN tolfa_state as ts on ts.id = tc.state_id where tc.active = 1`;

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
    let { name, created_by, state_id } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      state_id,
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
        ${state_id},
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
    let { name, id, updated_by, state_id } = body;

    const statement = `UPDATE ${TABLE_NAME} set 
    name = '${name}', 
    state_id = ${state_id}, 
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
    const record = await TolfaCity.findByPk(id);

    if (!record) {
      return res.status(404).json({
        status: 404,
        message: "Record not found",
        success: false,
      });
    }

    // Check if the record is being used in TolfaBlockNumber
    const tolfaArea = await TolfaCityArea.findAll({
      where: { city_id: id, active: 1 },
    });

    if (tolfaArea.length > 0) {
      return res.status(400).json({
        status: 400,
        message:
          "Cannot delete this city as it is being used in one or more city area.",
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

/**
 * @migration - Sequelize
 */

exports.updateById = async (req, res) => {
  try {
    let data = req.body;
    let token = req.headers.auth_token;
    let userToken = await decodeToken(token);
    let payload = {
      ...data,
      updated_at: undefined,
      updated_by: userToken.id,
    };
    let updatedData = await tolfaCityInit.updateTolfaCity(data.id, payload);

    if (updatedData) {
      res.status(200).json({
        message: "data fetched",
        data: { ...updatedData },
      });
    } else {
      res.status(400).json({
        message: "BAD REQUEST",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};
