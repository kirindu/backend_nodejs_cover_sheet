const {Schema, model} = require('mongoose');

const TruckSchema = Schema({

    name: {type: String,maxlength: 250, required: true},
    user: {type: Schema.Types.ObjectId,  required: true, ref: 'User'}
},{ collection:'trucks', // Nombramos a como queremos que se llame la coleccion en la base de datos
    timestamps: true
});

module.exports = model('Truck', TruckSchema);