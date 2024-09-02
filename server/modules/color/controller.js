const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaAdmissionStatus } = require("../admission-status/model/admission-status.model");
const { TolfaColor } = require("./model/color.model"); // Update the path as necessary
const { rogerSequelize } = require("../../../database/sequelize");
const { Op } = require('sequelize');

// Get all colors
const getAllColors = async (req, res) => {
  try {
    const colors = await TolfaColor.findAll();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching colors." });
  }
};

// Get a color by ID
const getColorById = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await TolfaColor.findByPk(id);
    if (color) {
      res.status(200).json(color);
    } else {
      res.status(404).json({ message: "Color not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the color." });
  }
};

// Get all active colors
const getActiveColors = async (req, res) => {
  try {
    const activeColors = await TolfaColor.findAll({
      where: {
        active: true,
      },
    });
    res.status(200).json(activeColors);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching active colors." });
  }
};

// Create a new color
const createColor = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  const { color_type, name, created_by, updated_by } = req.body;

  try {
    // Check if a color with the same color_type and name already exists
    const existingColor = await TolfaColor.findOne({
      where: {
        color_type,
        name,
      },
    });

    if (existingColor) {
      return res
        .status(400)
        .json({ error: "Color with the same type and name already exists." });
    }

    // If no existing color is found, create a new color
    const newColor = await TolfaColor.create({
      color_type,
      name,
      created_by,
      updated_by,
    });

    res.status(201).json(newColor);
  } catch (error) {
    console.error("Error creating color:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the color." });
  }
};

// Update a color by ID
const updateColor = async (req, res) => {
  const { id } = req.params;
  const { color_type, name, updated_by, active } = req.body;
  try {
    const color = await TolfaColor.findByPk(id);
    if (color) {
      await color.update({
        color_type,
        name,
        updated_by,
        active,
      });
      res.status(200).json(color);
    } else {
      res.status(404).json({ message: "Color not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the color." });
  }
};

// Delete a color by ID
const deleteColor = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await TolfaColor.findByPk(id);
    if (!color) {
      return res.status(404).json({ message: "Color not found." });
    }

    // Check if the color is being used in TolfaAdmissionStatus
    const isColorUsed = await TolfaAdmissionStatus.findOne({
      where: {
        [Op.or]: [
          { main_color_id: id },
          { second_color_id: id },
          { thirdcolor_id: id },
        ],
      },
    });

    if (isColorUsed) {
      return res.status(400).json({
        message:
          "Color is being used in Tolfa Admission Status and cannot be deleted.",
      });
    }

    // If the color is not being used, delete it
    await color.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the color." });
  }
};

module.exports = {
  getAllColors,
  getColorById,
  getActiveColors, // Export the new function
  createColor,
  updateColor,
  deleteColor,
};
