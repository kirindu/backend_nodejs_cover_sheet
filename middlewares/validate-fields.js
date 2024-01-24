
const {validationResult} = require('express-validator');


const validateFields = (req, res, next) => {

  // With this we can get the errors that the middleware 'check' detected
  const errors = validationResult(req);

  if(!errors.isEmpty()) {

    return res.status(200).json({
        ok: false,
        errors: errors.mapped(),
      });

  }

  next();
}

module.exports = {
    validateFields 
}