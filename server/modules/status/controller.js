const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaStatus } = require("./model/stauts.model"); // Adjust the path as needed

// Create a new TolfaStatus
const createTolfaStatus = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  const { name, created_by, updated_by } = req.body;

  try {
    // Check for duplicates
    const existingStatus = await TolfaStatus.findOne({ where: { name } });
    if (existingStatus) {
      return res
        .status(400)
        .json({ error: "Status with the same name already exists." });
    }

    // Create a new status record
    const newStatus = await TolfaStatus.create({
      name,
      created_by,
      updated_by,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating TolfaStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the status." });
  }
};

// Get all TolfaStatus records
const getAllTolfaStatus = async (req, res) => {
  try {
    const statuses = await TolfaStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching TolfaStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the statuses." });
  }
};

// Get a single TolfaStatus by ID
const getTolfaStatusById = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching TolfaStatus by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the status." });
  }
};

// Update a TolfaStatus by ID
const updateTolfaStatus = async (req, res) => {
  const { id } = req.params;
  const { name, updated_by } = req.body;

  try {
    const status = await TolfaStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }

    // Check for duplicates when updating the name
    if (name && name !== status.name) {
      const existingStatus = await TolfaStatus.findOne({ where: { name } });
      if (existingStatus) {
        return res
          .status(400)
          .json({ error: "Status with the same name already exists." });
      }
    }

    await status.update({
      name,
      updated_by,
      updated_at: new Date(),
    });

    res.status(200).json(status);
  } catch (error) {
    console.error("Error updating TolfaStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the status." });
  }
};

// Delete a TolfaStatus by ID
const deleteTolfaStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }

    await status.destroy();
    res.status(200).json({ message: "Status deleted successfully." });
  } catch (error) {
    console.error("Error deleting TolfaStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the status." });
  }
};

module.exports = {
  createTolfaStatus,
  getAllTolfaStatus,
  getTolfaStatusById,
  updateTolfaStatus,
  deleteTolfaStatus,
};
