const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaCondition } = require("./model/condition.model"); // Adjust the path as needed

// Create a new TolfaCondition
const createTolfaCondition = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  const { name, created_by, updated_by } = req.body;

  try {
    // Check for duplicates
    const existingStatus = await TolfaCondition.findOne({ where: { name } });
    if (existingStatus) {
      return res
        .status(400)
        .json({ error: "Condition with the same name already exists." });
    }

    // Create a new status record
    const newStatus = await TolfaCondition.create({
      name,
      created_by,
      updated_by,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating TolfaCondition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the status." });
  }
};

// Get all TolfaCondition records
const getAllTolfaCondition = async (req, res) => {
  try {
    const statuses = await TolfaCondition.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching TolfaCondition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the statuses." });
  }
};

// Get a single TolfaCondition by ID
const getTolfaConditionById = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaCondition.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Condition not found." });
    }
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching TolfaCondition by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the status." });
  }
};

// Update a TolfaCondition by ID
const updateTolfaCondition = async (req, res) => {
  const { id } = req.params;
  const { name, updated_by } = req.body;

  try {
    const status = await TolfaCondition.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Condition not found." });
    }

    // Check for duplicates when updating the name
    if (name && name !== status.name) {
      const existingStatus = await TolfaCondition.findOne({ where: { name } });
      if (existingStatus) {
        return res
          .status(400)
          .json({ error: "Condition with the same name already exists." });
      }
    }

    await status.update({
      name,
      updated_by,
      updated_at: new Date(),
    });

    res.status(200).json(status);
  } catch (error) {
    console.error("Error updating TolfaCondition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the status." });
  }
};

// Delete a TolfaCondition by ID
const deleteTolfaCondition = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaCondition.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Condition not found." });
    }

    await status.destroy();
    res.status(200).json({ message: "Condition deleted successfully." });
  } catch (error) {
    console.error("Error deleting TolfaCondition:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the status." });
  }
};

module.exports = {
  createTolfaCondition,
  getAllTolfaCondition,
  getTolfaConditionById,
  updateTolfaCondition,
  deleteTolfaCondition,
};
