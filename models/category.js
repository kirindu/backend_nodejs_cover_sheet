const {Schema, model} = require('mongoose');

const CategorySchema = Schema({

    name: {type: String,maxlength: 250, required: true},
    user: {type: Schema.Types.ObjectId,  required: true, ref: 'User'}
},{ collection:'categories', // Nombramos a como queremos que se llame la coleccion en la base de datos
    timestamps: true
});

module.exports = model('Category', CategorySchema);