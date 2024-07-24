const { TolfaArea } = require("./model/tolfa-area.model");

exports.duplicate = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check for duplicate name
    const existingRecord = await TolfaArea.findOne({
      where: { name: name, active: 1 },
    });

    if (existingRecord) {
      return res.status(422).json({
        message: "Data already exists with this name",
      });
    }

    // Proceed to the next middleware or controller if no duplicate found
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
