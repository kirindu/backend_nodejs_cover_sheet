const {Schema, model} = require('mongoose');

const ImageSchema = Schema({

    name: {type: String,maxlength: 250, required: true},
    price: {type: Number, required: true},
    description:  {type: String,maxlength: 250, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    creationDate: {
        type: Date,
        default: Date.now(),
      },
},{ collection:'images', // Nombramos a como queremos que se llame la coleccion en la base de datos
    timestamps: true
});

module.exports = model('Image', ImageSchema);


