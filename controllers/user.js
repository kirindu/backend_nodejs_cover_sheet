const User = require("../models/user");
const bcrypt = require("bcryptjs");
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

const createUsers = async (req, res) => {
  const { name, surname, password, email, rol } = req.body;

  try {
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(200).json({
        ok: false,
        msg: "this email is already registered",
      });
    }

    const user = new User(req.body);
    //Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save User
    await user.save();

    
    const token = await getJWT(user._id);


    res.status(200).json({
      ok: true,
      user,
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

const updateUsers = async (req, res) => {
  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(401).json({
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
        return res.status(200).json({
          ok: false,
          msg: "There is already a user with this email",
        });


      } else {

        //Si se sta reciviendo un passsword y es diferente de 'thesame' es que se desea cambiar , por lo que procedemos a generarlo y agregarlo
        if(req.body.password && req.body.password !== 'thesame') {
        //Encrypt password
        const salt = bcrypt.genSaltSync();
        fields.password = bcrypt.hashSync(password, salt);
        }
      
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
    } else {

           const userUpdated = await User.findByIdAndUpdate(uid, fields, {
             new: true,
           });
           res.status(200).json({
             ok: true,
             user: userUpdated,
           });

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
  getUser,
};
