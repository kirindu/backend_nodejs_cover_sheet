const {Schema, model} = require('mongoose');

const PostSchema = Schema({

    name: {type: String,maxlength: 250, required: true},

    images: [
        {
            image_name: {type: String,maxlength: 250},
            image_url: {type: String,maxlength: 250},
        }     
    ],


    // image: {type: String,maxlength: 250},
    // image_url: {type: String,maxlength: 250},

    price: {type: Number, required: true},
    description:  {type: String,maxlength: 250, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    creationDate: {
        type: Date,
        default: Date.now(),
      },
},{ collection:'posts', // Nombramos a como queremos que se llame la coleccion en la base de datos
    timestamps: true
});

module.exports = model('Post', PostSchema);


