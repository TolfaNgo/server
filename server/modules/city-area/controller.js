const pool = require("../../../database");
const moment = require("moment");
const { TolfaCityArea } = require("./model/city-area.model");
const { decodeToken } = require("../../middleware/auth.middleware");
const TABLE_NAME = "tolfa_city_area";

exports.get = async (req, res) => {
  const statement = `SELECT 
  tca.id as id, 
  tca.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  tca.created_at as created_at,
  tca.updated_at as updated_at,
  ts.name as city_name,
  ts.id as city_id
  FROM tolfa_city_area as tca 
  INNER JOIN tolfa_user as tu on tu.id = tca.updated_by
  INNER JOIN tolfa_user as itu on itu.id = tca.created_by 
  INNER JOIN tolfa_city as ts on ts.id = tca.city_id where tca.active = 1`;

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
    let { name, created_by, city_id } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      city_id,
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
        ${city_id},
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

exports.updateById = async (req, res) => {
  try {
    const { id } = req.body;
    let token = req.headers.auth_token;
    let userToken = await decodeToken(token);
    // Ensure id is provided
    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "ID is required",
        success: false,
      });
    }

    // Find the record by ID
    let cityArea = await TolfaCityArea.findByPk(id);

    if (!cityArea) {
      return res.status(404).json({
        status: 404,
        message: "Record not found",
        success: false,
      });
    }

    const payload = {
      ...req.body,
      id: id,
      city_id: req.body.city_id,
      name: req.body.name,
      updated_by: userToken.id,
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    cityArea = await TolfaCityArea.update(payload, {
      where: { id: id }, // Specify the where clause to update by ID
    });

    res.status(200).json({
      status: 200,
      message: "Record updated successfully",
      success: true,
      data: cityArea,
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
    const cityArea = await TolfaCityArea.findByPk(id);

    if (!cityArea) {
      return res.status(404).json({
        status: 404,
        message: "Record not found",
        success: false,
      });
    }

    // Update the record with new values
    const updateResponse = await TolfaCityArea.update(
      {
        active: 0,
      },
      { where: { id } }
    );

    res.status(200).json({
      status: 200,
      message: "Record deleted successfully",
      success: true,
      data: updateResponse,
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
