const fs = require("fs");
const Posts = require("../models/post");
const bcrypt = require("bcryptjs");
const { getJWT } = require("../helpers/jwt");
const { v4: uuidv4 } = require("uuid");

const getPosts = async (req, res) => {
  const posts = await Posts.find({})
    .populate("category", "name")
    .populate("user", "name");

  res.status(200).json({
    ok: true,
    posts,
  });
};

const createPost = async (req, res) => {
  // Este metodo Post sera especial porque no podiamos separar el File de form-data que es el medio que se sube
  //la imagen y el raq Json de los datos y mandar los dos al mismo tiempo, por lo que acudiremos a mandar
  //todo de una vez por form.data :

  /*
    You should just append each text input one by one to the formData object, and each will be available as a property on the req.body object:

formData.append('name', 'vasu')
formData.append('email', 'vasutiwari@gmail.com')
formData.append('role', 'student')
*/

  const uid = req.uid; // recuperamos el uid previamente insertado por la validacion del token.

  const post = new Posts({
    user: uid, // en este caso user corresponde al id del usuario a como lo definimios en el modelo
    ...req.body,
  });

  // Validamos que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No files were uploaded.",
    });
  }

  // Procesamos la imagen
  const file = req.files.image;

  // Podemos delimitar el peso

  if (file.size / 1024 > 1024) {
    return res.status(400).json({
      ok: false,
      msg: "The image cannot weigh more than 1 M.",
    });
  }

  //Extraemos la extension
  const nameCuted = file.name.split(".");
  const extFile = nameCuted[nameCuted.length - 1];

  //Validar extension
  const extValid = ["png", "jpg", "jpeg"];
  if (!extValid.includes(extFile)) {
    return res.status(400).json({
      ok: false,
      msg: "Extension Invalid.",
    });
  }

  // Generamos el nombre del archivo de la imagen usando uuid

  const nameImage = `${uuidv4()}.${extFile}`;

  // Path para guardar la imagen

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

  try {
    // Salvamos a la BD

    post.image = path; // Guardamos el path de la imagen
    const postDB = await post.save();

    res.status(400).json({
      ok: true,
      postDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
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

    if (!req.files || Object.keys(req.files).length === 0) {
      //Sino se selecciona ninguna imagen, solo actualizamos lo que haya

      post.image = postDB.image; //Setiemos de nuevo la misma ruta de la imagen original

      const postUpdated = await Posts.findByIdAndUpdate(uid, post, {
        new: true,
      });
      res.status(200).json({
        ok: true,
        user: postUpdated,
      });
    } else {
      // Procesamos la imagen
      const file = req.files.image;

      // Podemos delimitar el peso

      if (file.size / 1024 > 1024) {
        return res.status(400).json({
          ok: false,
          msg: "The image cannot weigh more than 1 M.",
        });
      }

      //Extraemos la extension
      const nameCuted = file.name.split(".");
      const extFile = nameCuted[nameCuted.length - 1];

      //Validar extension
      const extValid = ["png", "jpg", "jpeg"];
      if (!extValid.includes(extFile)) {
        return res.status(400).json({
          ok: false,
          msg: "Extension Invalid.",
        });
      }

      //Borramos la imagen vieja :

      const OldPath = postDB.image; // Obtenemos el path de la imagen anterior

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath);
      }

      // Generamos el nombre del archivo de la imagen usando uuid

      const nameImage = `${uuidv4()}.${extFile}`;

      // Path para guardar la imagen

      const path = `./uploads/posts/${nameImage}`;
      post.image = path; // Guardamos el path de la imagen

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

      const postUpdated = await Posts.findByIdAndUpdate(uid, post, {
        new: true,
      });
      res.status(200).json({
        ok: true,
        user: postUpdated,
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

const deletePost = async (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "deletePost",
  });
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
