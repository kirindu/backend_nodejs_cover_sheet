const Image = require("../models/image");
const bcrypt = require("bcryptjs");
const { getJWT } = require("../helpers/jwt");


const getImages = async (req, res) => {

    res.status(200).json({
      ok: true,
      msg: 'getImages'
    });
  };
  
  const createImage = async (req, res) => {
    const uid = req.uid; // recuperamos el uid previamente insertado por la validacion del token.

    const image = new Image({
      user: uid, // en este caso user corresponde al nombre a como lo definimios en el modelo
      ...req.body,
    });
  
    try {
      const imageDB = await image.save();
  
      res.status(200).json({
        ok: true,
        image: imageDB,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "An unexpected error occurred, please check the log",

      });
    }

  };
  
  const updateImage = async (req, res) => {

    res.status(200).json({
        ok: true,
        msg: 'updateImage'
      });

  };
  
  const deleteImage = async (req, res) => {

    res.status(200).json({
        ok: true,
        msg: 'deleteUser'
      });

  };
  
  module.exports = {
    getImages,
    createImage,
    updateImage,
    deleteImage,
  };
  