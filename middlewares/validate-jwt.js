const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  // Read Token

  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token not found",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    // Le pasamos el uid al req, para que lo podamos acceder luego
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token not valid",
    });
  }
};
module.exports = [validateJWT];
