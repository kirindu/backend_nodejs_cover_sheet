const Route = require("../models/route");

const getRoutes = async(req, res) => {

    const routes = await Route.find({});

res.status(200).json({
    ok: true,
    routes
  });
};

const createRoutes = async (req, res) => {
  const uid = req.uid; // recuperamos el uid del  usuario previamente insertado por la validacion del token.

  const {name} = req.body;
  const route = new Route({
    user: uid, // en este caso user corresponde al nombre a como lo definimios en el modelo
    ...req.body,
  });

  try {

    const existRoute = await Route.findOne({ name });

    if (existRoute) {
        return res.status(200).json({
          ok: false,
          msg: "this route is already registered",
        });
      }

    const routeDB = await route.save();

    res.status(200).json({
      ok: true,
      route: routeDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",

    });
  }
};

const updateRoutes = async (req, res) => {

    const uid = req.params.id; //recibimos el id de la route


   try {
    const routeDB = await Route.findById(uid);

    if (!routeDB) {
      return res.status(404).json({
        ok: false,
        msg: "route not found",
      });
    }

    // Updates

    const {...fields } = req.body;
    const routeUpdated = await Route.findByIdAndUpdate(uid, fields, {
        new: true,
      });
      res.status(200).json({
        ok: true,
        user: routeDB,
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

const deleteRoutes = async (req, res) => {
  try {
    const uid = req.params.id; //recibimos el id de la route
    const userId = req.uid; // recuperamos el uid del usuario previamente insertado por la validacion del token.

    const routeDB = await Route.findById(uid);

    if (!routeDB) {
      return res.status(404).json({
        ok: false,
        msg: "Route not found",
      });
    }


    const routeDeleted = await Route.findByIdAndDelete(uid, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      user: routeDeleted,
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
  getRoutes,
  createRoutes,
  updateRoutes,
  deleteRoutes,
};
