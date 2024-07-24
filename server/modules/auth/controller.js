const pool = require("../../../database");
const jwt = require("jsonwebtoken");
const { secret } = require("../../constant/secret.constant");

exports.login = async (req, res, next) => {
  const { body } = req;
  const { phone_no, password } = body;

  const TABLE_NAME = "tolfa_user";

  let statement = `SELECT *, COUNT(*) AS cnt FROM ${TABLE_NAME} WHERE phone_no = ${phone_no} AND password = '${password}'`;

  pool.query(statement, (err, result, fields) => {
    try {
      if (result[0].cnt > 0) {
        var token = jwt.sign({ phone_no: phone_no, id: result[0].id }, secret, {
          expiresIn: 18640000,
          // expiresIn: 3600,
        });
        res.status(200).json({
          message: "Logged in!",
          status: 200,
          success: true,
          data: { ...result[0], token },
        });
      } else {
        res.status(422).json({
          message: "Invalid mobile number or password",
          status: 422,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

/* Forgot password / change password */

exports.deleteUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { user_id } = body;

    const statement = `DELETE FROM dog_user WHERE ID = ${user_id}`;
    pool.query(statement, (error, result, fields) => {
      if (error) {
        res.status(500).json({
          message: error,
          success: false,
          code: 500,
        });
        return;
      }

      if (result) {
        res.status(422).json({
          message: "User deleted",
          success: true,
          code: 200,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      success: false,
      code: 500,
    });
  }
};
