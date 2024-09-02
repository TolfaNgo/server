const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaBodyScore } = require("./model/body-score.model"); // Adjust the path as needed

// Create a new TolfaBodyScore
const create = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  const { name, created_by, updated_by } = req.body;

  try {
    // Check for duplicates
    const existingStatus = await TolfaBodyScore.findOne({ where: { name } });
    if (existingStatus) {
      return res
        .status(400)
        .json({ error: "Condition with the same name already exists." });
    }

    // Create a new status record
    const newStatus = await TolfaBodyScore.create({
      name,
      created_by,
      updated_by,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating TolfaBodyScore:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the status." });
  }
};

// Get all TolfaBodyScore records
const getAll = async (req, res) => {
  try {
    const statuses = await TolfaBodyScore.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching TolfaBodyScore:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the statuses." });
  }
};

// Get a single TolfaBodyScore by ID
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaBodyScore.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Condition not found." });
    }
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching TolfaBodyScore by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the status." });
  }
};

// Update a TolfaBodyScore by ID
const updateById = async (req, res) => {
  const { id } = req.params;
  const { name, updated_by } = req.body;

  try {
    const status = await TolfaBodyScore.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Condition not found." });
    }

    // Check for duplicates when updating the name
    if (name && name !== status.name) {
      const existingStatus = await TolfaBodyScore.findOne({ where: { name } });
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
    console.error("Error updating TolfaBodyScore:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the status." });
  }
};

// Delete a TolfaBodyScore by ID
const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaBodyScore.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Condition not found." });
    }

    await status.destroy();
    res.status(200).json({ message: "Condition deleted successfully." });
  } catch (error) {
    console.error("Error deleting TolfaBodyScore:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the status." });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
