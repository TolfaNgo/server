const pool = require("../../../database");

exports.duplicate = async (req, res, next) => {
  try {
    let { body } = req;
    let { name } = body;

    const statement = `SELECT * FROM tolfa_rescue_type WHERE name = '${name}' and active = 1`;
    console.log(statement);
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        if (results && results.length) {
          res.status(422).json({
            message: "Rescue type already exist with this name",
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
