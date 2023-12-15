const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  const users = await User.find({}, "name rol surname email state google");

  res.status(200).json({
    ok: true,
    users,
  });
};

const createUsers = async (req, res) => {
  const { name, surname, password, email, rol } = req.body;

  try {
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: "this email is already registered",
      });
    }

    const user = new User(req.body);
    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Sace User
    await user.save();
    res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

const updateUsers = async (req, res) => {
  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    // Updates
    //  const fields = req.body;

    // Quitamos el password el email y google para que no sean actualizados de los compos que vienen en el body
    const { password, google, email, ...fields } = req.body;

    // Si el email es diferente , buscamos si ya existe registrado antes , sino agregamos denuevo el campo y actualizamo.
    if (userDB.email !== req.body.email) {
      const existEmail = await User.findOne({ email: req.body.email });
      if (existEmail) {
        return res.status(400).json({
          ok: false,
          msg: "There is already a user with this email",
        });
      }
     else {
      // Si el email no existe entonces procedemos a actualizar, pero antes agregamos el email de nuevo a los campos
      fields.email = email;
      const userUpdated = await User.findByIdAndUpdate(uid, fields, {
        new: true,
      });
      res.status(200).json({
        ok: true,
        user: userUpdated,
      });
     }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

module.exports = {
  getUsers,
  createUsers,
  updateUsers,
};
