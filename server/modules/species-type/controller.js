const pool = require("../../../database");
const moment = require("moment");
const TABLE_NAME = "tolfa_species";
const { TolfaSpecies } = require("./model/species-type.model");
const { decodeToken } = require("../../middleware/auth.middleware");

const tolfaSpeciesInit = new TolfaSpecies();

exports.get = async (req, res) => {
  const statement = `SELECT 
  ts.id as id, 
  ts.name as name, 
  itu.name as created_by, 
  tu.name as updated_by,
  ts.created_at as created_at,
  ts.updated_at as updated_at,
  trt.name as rescue_type_name,
  trt.id as rescue_type_id
  FROM tolfa_species as ts 
  INNER JOIN tolfa_user as tu on tu.id = ts.updated_by
  INNER JOIN tolfa_user as itu on itu.id = ts.created_by 
  INNER JOIN tolfa_rescue_type as trt on trt.id = ts.rescue_type_id where ts.active = 1`;

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
          message: "species data",
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
    let { name, created_by, rescue_type_id } = body;

    const statement = `INSERT INTO ${TABLE_NAME} (
      name, 
      rescue_type_id,
      created_by,
      updated_by,
      created_at, 
      updated_at
      ) values(
        '${name}',
        ${rescue_type_id},
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
          message: "Species added successfuly",
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
    let { name, id, updated_by, rescue_type_id } = body;

    const statement = `UPDATE ${TABLE_NAME} set 
    name = '${name}', 
    rescue_type_id = ${rescue_type_id}, 
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
          message: "Species updated successfuly",
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
    let updatedData = await tolfaSpeciesInit.updateTolfaSpecies(
      data.id,
      payload
    );

    if (updatedData) {
      res.status(200).json({
        message: "user fetched",
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
