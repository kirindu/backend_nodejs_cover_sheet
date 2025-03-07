const Truck = require("../models/truck");

const getTrucks = async(req, res) => {

    const trucks = await Truck.find({});

res.status(200).json({
    ok: true,
    trucks
  });
};

const createTrucks = async (req, res) => {
  const uid = req.uid; // recuperamos el uid del  usuario previamente insertado por la validacion del token.

  const {name} = req.body;
  const truck = new Truck({
    user: uid, // en este caso user corresponde al nombre a como lo definimios en el modelo
    ...req.body,
  });

  try {

    const existTruck = await Truck.findOne({ name });

    if (existTruck) {
        return res.status(200).json({
          ok: false,
          msg: "this truck is already registered",
        });
      }

    const truckDB = await truck.save();

    res.status(200).json({
      ok: true,
      truck: truckDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",

    });
  }
};

const updateTrucks = async (req, res) => {

    const uid = req.params.id; //recibimos el id de la truck


   try {
    const truckDB = await Truck.findById(uid);

    if (!truckDB) {
      return res.status(404).json({
        ok: false,
        msg: "truck not found",
      });
    }

    // Updates

    const {...fields } = req.body;
    const truckUpdated = await Truck.findByIdAndUpdate(uid, fields, {
        new: true,
      });
      res.status(200).json({
        ok: true,
        user: truckUpdated,
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An unexpected error occurred, please check the log",
    });
  }
};

const deleteTrucks = async (req, res) => {
  try {
    const uid = req.params.id; //recibimos el id de la truck
    const userId = req.uid; // recuperamos el uid del usuario previamente insertado por la validacion del token.

    const truckDB = await Truck.findById(uid);

    if (!truckDB) {
      return res.status(404).json({
        ok: false,
        msg: "Truck not found",
      });
    }


    const truckDeleted = await Truck.findByIdAndDelete(uid, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      user: truckDeleted,
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
  getTrucks,
  createTrucks,
  updateTrucks,
  deleteTrucks,
};
