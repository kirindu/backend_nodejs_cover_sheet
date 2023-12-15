const {Schema, model} = require('mongoose');

const UserSchema = Schema({

    rol: {type: String,maxlength: 30, default: 'USER_ROLE', required: true},
    name: {type: String,maxlength: 250, required: true},
    surname: {type: String,maxlength: 250, required: true},
    email: {type: String,maxlength: 250, required: true, unique: true},
    password: {type: String,maxlength: 250, required: true},
    avatar: {type: String,maxlength: 250, required: false},
    state: {type: Number,default: 1}, // 1 is active , 2 is inactive
    password: {type: String,maxlength: 250, required: false},
    google: {type: String,maxlength: 30, required: false},
},{
    timestamps: true
});

module.exports = model('User', UserSchema);


