const pool = require("../../../database");

exports.duplicate = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, state_id } = body;

    const statement = `SELECT * FROM tolfa_city WHERE name = '${name}' AND state_id = ${state_id} AND active = 1`;
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        if (results && results.length) {
          res.status(422).json({
            message: "data already exist with this name",
          });
        } else {
          next();
        }
      });
    };
    query(statement);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
