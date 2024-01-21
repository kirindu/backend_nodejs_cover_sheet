const jwt = require("jsonwebtoken");

const getJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "365 days",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Error generating JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
    getJWT,
}
