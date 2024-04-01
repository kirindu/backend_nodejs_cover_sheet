const {Schema, model} = require('mongoose');

const PostSchema = Schema({

 
    

    price: {type: Number, required: true},
    description:  {type: String,maxlength: 250, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},

    images: [
        {
            image_name: {type: String,maxlength: 250},
            image_url: {type: String,maxlength: 250},
        }     
    ],

    year: {type: Number, required: false},
    manufacturer:  {type: String,maxlength: 250, required: false},
    body:  {type: String,maxlength: 250, required: false},
    engine:  {type: String,maxlength: 250, required: false},
    powerTrain:  {type: String,maxlength: 250, required: false},
    chassis:  {type: String,maxlength: 250, required: false},


   
    // make: {type: String,maxlength: 250, required: false},
    // model: {type: String,maxlength: 250, required: false},
    // engine:{type: String,maxlength: 250, required: false},
    // transmission: {type: String,maxlength: 250, required: false},
    // suspension:{type: String,maxlength: 250, required: false},
    // fuel: {type: String,maxlength: 250, required: false},
    // vin: {type: String,maxlength: 250, required: false},
    // bodySize: {type: String,maxlength: 250, required: false},


    creationDate: {
        type: Date,
        default: Date.now(),
      },
},{ collection:'posts', // Nombramos a como queremos que se llame la coleccion en la base de datos
    timestamps: true
});

module.exports = model('Post', PostSchema);


