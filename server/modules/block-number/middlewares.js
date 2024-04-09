const pool = require("../../../database");

exports.duplicate = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, area_id } = body;

    const statement = `SELECT * FROM tolfa_block_number WHERE name = '${name}' AND 	area_id = ${area_id} AND active = ${false}`;
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
