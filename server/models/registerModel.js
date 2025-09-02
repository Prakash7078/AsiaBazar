const mongoose = require('mongoose');
const registerModel=new mongoose.Schema({
    clubname: {type: String, required: true},
    event:{type: Object, required: true},
    eventregisteruser:{type: Object,required: true},
    isWinner:{type:Boolean,required:true},
    isRunner:{type:Boolean,required:true},
},{
    timestamps:true,
});
const Register=mongoose.model('Register',registerModel);
module.exports=Register;