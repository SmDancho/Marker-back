const User = require('../models/user.js');
const Role = require('../models/role.js');

const getUsers = async (_, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getUserByid = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);

    return res.json(user);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    await user.deleteOne();
    return res.json({ message: 'user removed' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    const adminRole = await Role.findOne({ value: 'ADMIN' });
    if (user.roles.includes(adminRole.value)) {
      await user.updateOne({ $pull: { roles: adminRole.value } });
      return res.json({ message: 'user is not admin now' });
    }
    await user.updateOne({ $push: { roles: adminRole.value } });
    return res.json({ message: 'user is admin ' });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    const blockRole = await Role.findOne({ value: 'BLOCKED' });
    console.log(user);
    if (user.roles.includes(blockRole.value)) {
      await user.updateOne({ $pull: { roles: blockRole.value } });
      return res.json({ message: 'user unblocked' });
    }
    await user.updateOne({ $push: { roles: blockRole.value } });
    return res.json({ message: 'user blocked' });
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = {
  getUsers,
  getUserByid,
  deleteUser,
  makeAdmin,
  blockUser,
};
