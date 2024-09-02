const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaAbcStatus } = require("./model/abc-stauts.model"); // Adjust the path as needed

// Create a new TolfaAbcStatus
const createTolfaAbcStatus = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  const { name, created_by, updated_by } = req.body;

  try {
    // Check for duplicates
    const existingStatus = await TolfaAbcStatus.findOne({ where: { name } });
    if (existingStatus) {
      return res
        .status(400)
        .json({ error: "Status with the same name already exists." });
    }

    // Create a new status record
    const newStatus = await TolfaAbcStatus.create({
      name,
      created_by,
      updated_by,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error creating TolfaAbcStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the status." });
  }
};

// Get all TolfaAbcStatus records
const getAllTolfaAbcStatus = async (req, res) => {
  try {
    const statuses = await TolfaAbcStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching TolfaAbcStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the statuses." });
  }
};

// Get a single TolfaAbcStatus by ID
const getTolfaAbcStatusById = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaAbcStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }
    res.status(200).json(status);
  } catch (error) {
    console.error("Error fetching TolfaAbcStatus by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the status." });
  }
};

// Update a TolfaAbcStatus by ID
const updateTolfaAbcStatus = async (req, res) => {
  const { id } = req.params;
  const { name, updated_by } = req.body;

  try {
    const status = await TolfaAbcStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }

    // Check for duplicates when updating the name
    if (name && name !== status.name) {
      const existingStatus = await TolfaAbcStatus.findOne({ where: { name } });
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
    console.error("Error updating TolfaAbcStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the status." });
  }
};

// Delete a TolfaAbcStatus by ID
const deleteTolfaAbcStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await TolfaAbcStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }

    await status.destroy();
    res.status(200).json({ message: "Status deleted successfully." });
  } catch (error) {
    console.error("Error deleting TolfaAbcStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the status." });
  }
};

module.exports = {
  createTolfaAbcStatus,
  getAllTolfaAbcStatus,
  getTolfaAbcStatusById,
  updateTolfaAbcStatus,
  deleteTolfaAbcStatus,
};
