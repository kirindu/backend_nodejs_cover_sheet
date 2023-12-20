const User = require("../models/image");
const bcrypt = require("bcryptjs");
const { getJWT } = require("../helpers/jwt");


const getImages = async (req, res) => {

    res.status(200).json({
      ok: true,
      msg: 'getImages'
    });
  };
  
  const createImage = async (req, res) => {

    res.status(200).json({
        ok: true,
        msg: 'createImage'
      });

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
  