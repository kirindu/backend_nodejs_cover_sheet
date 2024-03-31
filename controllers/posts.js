const fs = require("fs");
const path = require("path");
const Posts = require("../models/post");
const bcrypt = require("bcryptjs");
const { getJWT } = require("../helpers/jwt");
const { v4: uuidv4 } = require("uuid");

const getPosts = async (req, res) => {
  const posts = await Posts.find({})
    .populate("category", "name")
    .populate("user", "name");

  return res.status(200).json({
    ok: true,
    posts,
  });
};

const getImage = async (req, res) => {
  const image = req.params.image;
  const pathImg = path.join(__dirname, `../uploads/posts/${image}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no_image_available.jpg`);
    res.sendFile(pathImg);
  }
};

const createPost = async (req, res) => {
  const uid = req.uid; // recuperamos el uid previamente insertado por la validacion del token.

  const post = new Posts({
    user: uid, // en este caso user corresponde al id del usuario a como lo definimios en el modelo
    ...req.body,
  });

  // Validamos que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(200).json({
      ok: false,
      msg: "No files were uploaded.",
    });
  }

  // Validamos un maximo de 5 imagenes

  if (req.files.image.length !== undefined) {
    if (req.files.image.length > 15) {
      return res.status(200).json({
        ok: false,
        msg: "You can not upload more than 15 images.",
      });
    }
  }

  const images = [];
  const file = req.files.image;

  //Aqui es donde vamos a meter a las imagenes

  if (!Array.isArray(req.files.image)) {
    if (file.size / 1024 > 3072) {
      return res.status(200).json({
        ok: false,
        msg: `The image ${file.name} cannot be more than 3Mb in size`,
      });
    }

    //Extraemos la extension
    const nameCuted = file.name.split(".");
    const extFile = nameCuted[nameCuted.length - 1];

    //Validar extension
    const extValid = ["png", "jpg", "jpeg"];
    if (!extValid.includes(extFile)) {
      return res.status(200).json({
        ok: false,
        msg: `The image ${file.name} has an invalid extension.`,
      });
    }

    // Generamos el nombre del archivo de la imagen usando uuid
    const nameImage = `${uuidv4()}.${extFile}`;

    // Generamos Path para guardar la imagen
    const path = `./uploads/posts/${nameImage}`;

    //Copiamos la imagen
    file.mv(path, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          msg: "Error copying the image",
        });
      }
    });

    images.push({
      image_name: path,
      image_url: process.env.PATH_IMAGE_SERVER + nameImage,
    });
  } else {
    req.files.image.forEach(async (file) => {
      // Podemos delimitar el peso
      if (file.size / 1024 > 3072) {
        return res.status(200).json({
          ok: false,
          msg: `The image ${file.name} cannot be more than 1Mb in size.`,
        });
      }

      //Extraemos la extension
      const nameCuted = file.name.split(".");
      const extFile = nameCuted[nameCuted.length - 1];

      //Validar extension
      const extValid = ["png", "jpg", "jpeg"];
      if (!extValid.includes(extFile)) {
        return res.status(200).json({
          ok: false,
          msg: `The image ${file.name} has an invalid extension.`,
        });
      }

      // Generamos el nombre del archivo de la imagen usando uuid
      const nameImage = `${uuidv4()}.${extFile}`;

      // Generamos Path para guardar la imagen
      const path = `./uploads/posts/${nameImage}`;

      //Copiamos la imagen
      file.mv(path, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            ok: false,
            msg: "Error copying the image",
          });
        }
      });

      images.push({
        image_name: path,
        image_url: process.env.PATH_IMAGE_SERVER + nameImage,
      });
    });
  }

  try {
    // Salvamos a la BD

    post.images = images;

    //   post.images.image_name = path; // Guardamos el path de la imagen
    //   post.images.image_url = process.env.PATH_IMAGE_SERVER + nameImage;
    const postDB = await post.save();

    return res.status(200).json({
      ok: true,
      postDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

const updatePost = async (req, res) => {
  const uid = req.params.id; //recibimos el id del post
  const userId = req.uid; // recuperamos el uid del usuario previamente insertado por la validacion del token.

  const post = {
    user: userId, // en este caso user corresponde al nombre a como lo definimios en el modelo
    ...req.body,
  };

  try {
    const postDB = await Posts.findById(uid);

    if (!postDB) {
      return res.status(404).json({
        ok: false,
        msg: "post not found",
      });
    }

    // Updates

    // En teoria si no viene ninguna imagen nueva, las imagenes viejas se mantienen, pero esto va a cambir mas adelante

    // Validamos que exista un archivo
    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(200).json({
    //     ok: false,
    //     msg: "No files were uploaded.",
    //   });
    // }

    // Validamos un maximo de 5 imagenes

    // if(req.files.image.length !== undefined) {

    //   if(req.files.image.length > 5) {
    //     return res.status(200).json({
    //       ok: false,
    //       msg: "You can not upload more than 5 images per post.",
    //     });
    //   }

    // }

    const images = [];

    //Borramos todas la imagenes del post
    //  postDB.images.forEach(img => {
    //   const OldPath = img.image_name; // Obtenemos el path de la imagen anterior

    //   if (fs.existsSync(OldPath)) {
    //     fs.unlinkSync(OldPath);
    //   }

    //  })

    if (req.files) {
      // Si vienen imagenes, aunque sea una

      const file = req.files.image;

      if (!Array.isArray(req.files.image)) {
        // Podemos delimitar el peso

        if (file.size / 1024 > 3072) {
          return res.status(200).json({
            ok: false,
            msg: `The image ${file.name} cannot weigh more than 3Mb.`,
          });
        }

        //Extraemos la extension
        const nameCuted = file.name.split(".");
        const extFile = nameCuted[nameCuted.length - 1];

        //Validar extension
        const extValid = ["png", "jpg", "jpeg"];
        if (!extValid.includes(extFile)) {
          return res.status(200).json({
            ok: false,
            msg: `The image ${file.name} has an invalid extension.`,
          });
        }

        // Generamos el nombre del archivo de la imagen usando uuid
        const nameImage = `${uuidv4()}.${extFile}`;

        // Generamos Path para guardar la imagen
        const path = `./uploads/posts/${nameImage}`;

        //Copiamos la imagen
        file.mv(path, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              ok: false,
              msg: "Error to copy the image",
            });
          }
        });

        images.push({
          image_name: path,
          image_url: process.env.PATH_IMAGE_SERVER + nameImage,
        });
      } else {
        req.files.image.forEach(async (file) => {
          // Podemos delimitar el peso

          if (file.size / 1024 > 3072) {
            return res.status(200).json({
              ok: false,
              msg: `The image ${file.name} cannot weigh more than 3Mb.`,
            });
          }

          //Extraemos la extension
          const nameCuted = file.name.split(".");
          const extFile = nameCuted[nameCuted.length - 1];

          //Validar extension
          const extValid = ["png", "jpg", "jpeg"];
          if (!extValid.includes(extFile)) {
            return res.status(200).json({
              ok: false,
              msg: `The image ${file.name} has an invalid extension.`,
            });
          }

          // Generamos el nombre del archivo de la imagen usando uuid
          const nameImage = `${uuidv4()}.${extFile}`;

          // Generamos Path para guardar la imagen
          const path = `./uploads/posts/${nameImage}`;

          //Copiamos la imagen
          file.mv(path, (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                ok: false,
                msg: "Error to copy the image",
              });
            }
          });

          images.push({
            image_name: path,
            image_url: process.env.PATH_IMAGE_SERVER + nameImage,
          });
        });
      }

      try {
        // Actualizamos a la BD

        post.images = images;

        const postUpdated = await Posts.findByIdAndUpdate(uid, post, {
          new: true,
        });

        return res.status(200).json({
          ok: true,
          postUpdated,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          msg: "An unexpected error occurred, please check the log",
        });
      }
    } else {
      // Si no viene ninguna imagen solo actualizamos los demascampos

      try {
        // Actualizamos a la BD

        const postUpdated = await Posts.findByIdAndUpdate(uid, post, {
          new: true,
        });

        return res.status(200).json({
          ok: true,
          postUpdated,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          msg: "An unexpected error occurred, please check the log",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const uid = req.params.id; //recibimos el id del post
    const userId = req.uid; // recuperamos el uid del usuario previamente insertado por la validacion del token.

    const postDB = await Posts.findById(uid);

    if (!postDB) {
      return res.status(404).json({
        ok: false,
        msg: "post not found",
      });
    }

    //Borramos todas la imagenes del post
    postDB.images.forEach((img) => {
      const OldPath = img.image_name; // Obtenemos el path de la imagen anterior

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath);
      }
    });

    const postDeleted = await Posts.findByIdAndDelete(uid, {
      new: true,
    });

    return res.status(200).json({
      ok: true,
      user: postDeleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getImage,
};
