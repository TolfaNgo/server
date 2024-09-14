const { decodeToken } = require("../../middleware/auth.middleware");
const { TolfaUser } = require("./model/user.model"); // Adjust the path according to your project structure

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await TolfaUser.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

// GET user by ID
const getUserById = async (req, res) => {
  try {
    const user = await TolfaUser.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

// CREATE a new user
const createUser = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  try {
    const newUser = await TolfaUser.create({
      ...req.body,
      password: "Tolfa@123",
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
};

// UPDATE user by ID
const updateUser = async (req, res) => {
  let token = req.headers.auth_token;
  let userToken = await decodeToken(token);

  req.body.created_by = userToken.id;
  req.body.updated_by = userToken.id;

  try {
    const [updated] = await TolfaUser.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedUser = await TolfaUser.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

// DELETE user by ID
const deleteUser = async (req, res) => {
  try {
    const deleted = await TolfaUser.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
