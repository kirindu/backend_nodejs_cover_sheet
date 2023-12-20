const Category = require("../models/category");

const getCategories = (req, res) => {
  res.json({
    ok: true,
    msg: "getCategories",
  });
};

const createCategories = async (req, res) => {
  const uid = req.uid; // recuperamos el uid previamente insertado por la validacion del token.

  const category = new Category({
    user: uid, // en este caso user corresponde al nombre a como lo definimios en el modelo
    ...req.body,
  });

  try {
    const categoryDB = await category.save();

    res.status(200).json({
      ok: true,
      category: categoryDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "createCategories",
    });
  }
};

const updateCategories = (req, res) => {
  res.json({
    ok: true,
    msg: "updateCategories",
  });
};

const deleteCategories = (req, res) => {
  res.json({
    ok: true,
    msg: "deleteCategories",
  });
};

module.exports = {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
};
