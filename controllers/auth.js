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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

module.exports = {
  login,
};
