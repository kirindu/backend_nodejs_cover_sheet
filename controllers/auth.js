const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { getJWT } = require("../helpers/jwt");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // verify email
    const userDB = await User.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "email not found",
      });
    }

    //Verify password
    const validPassword = bcrypt.compareSync(password, userDB.password);

    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "wrong password",
      });
    }

    // GENERATE TOKEN

    const token = await getJWT(userDB._id);

    res.status(200).json({
      ok: true,
      token,
      user: {
        name: userDB.name, 
        surname: userDB.surname,
        email: userDB.email,
        rol: userDB.rol,
        uid: userDB.id,
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

const renewToken = async (req, res) => {

  const uid = req.uid;
  const token = await getJWT(uid);

  const infoUser = await User.findById(uid);



  res.status(200).json({
    ok: true,
    token,
    infoUser
  });

}

module.exports = {
  login,
  renewToken,
};
