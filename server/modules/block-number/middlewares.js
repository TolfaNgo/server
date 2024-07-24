const pool = require("../../../database");
const { TolfaBlockNumber } = require("./model/block-number.model");

exports.duplicate = async (req, res, next) => {
  try {
    const { name, area_id } = req.body;

    const existingRecord = await TolfaBlockNumber.findOne({
      where: {
        name: name,
        area_id: area_id,
        active: 1,
      },
    });

    if (existingRecord) {
      return res.status(422).json({
        message: "Data already exists with this name",
      });
    }

    next();
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
