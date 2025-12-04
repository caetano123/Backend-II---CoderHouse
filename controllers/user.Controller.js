const UserService = require('../services/userService');

exports.getProfile = async (req, res) => {
  try {
    const user = await UserService.getById(req.user._id);
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};
