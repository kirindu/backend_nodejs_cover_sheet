const Category = require("../models/category");

const getCategories = async(req, res) => {

    const categories = await Category.find({});

res.status(200).json({
    ok: true,
    categories
  });
};

const createCategories = async (req, res) => {
  const uid = req.uid; // recuperamos el uid del  usuario previamente insertado por la validacion del token.

  const {name} = req.body;
  const category = new Category({
    user: uid, // en este caso user corresponde al nombre a como lo definimios en el modelo
    ...req.body,
  });

  try {

    const existCategory = await Category.findOne({ name });

    if (existCategory) {
        return res.status(400).json({
          ok: false,
          msg: "this category is already registered",
        });
      }

    const categoryDB = await category.save();

    res.status(200).json({
      ok: true,
      category: categoryDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",

    });
  }
};

const updateCategories = async (req, res) => {

    const uid = req.params.id; //recibimos el id de la categoria


   try {
    const categoryDB = await Category.findById(uid);

    if (!categoryDB) {
      return res.status(404).json({
        ok: false,
        msg: "category not found",
      });
    }

    // Updates

    const {...fields } = req.body;
    const categoryUpdated = await Category.findByIdAndUpdate(uid, fields, {
        new: true,
      });
      res.status(200).json({
        ok: true,
        user: categoryUpdated,
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
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
