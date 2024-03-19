const User = require("../models/user");
const {getJWT} = require('../helpers/jwt');

const getUser = async (req, res) => {

  const uid = req.uid;
  const token = await getJWT(uid);

  const infoUser = await User.findById(uid);

  const userData = {

    "rol": infoUser.rol,
    "name": infoUser.name,
    "surname": infoUser.surname,
    "email": infoUser.email,
  }


 //  const { _id, password, state, createdAt, updatedAt, __v,  ...others } = infoUser; // Extraemos los campos que no queremos enviar, pero no funciono como se esperaba
  
  res.status(200).json({
    ok: true,
    token, // En teoria, si el token a comprobar es valido y aun no ha expirado se le renovara el token, pero seria bueno comprobar esto
    userData
  });
};

module.exports = {
  getUser,
};
