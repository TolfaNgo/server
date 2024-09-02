const pool = require("../../../database");

exports.duplicateRescueType = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, species_id } = body;

    const statement = `SELECT * FROM tolfa_animal_breed WHERE name = '${name}' and species_id = ${species_id}`;
    console.log(statement);
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        if (results && results.length) {
          res.status(422).json({
            message: "Data already exist with this name",
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
