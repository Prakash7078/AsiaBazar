const mongoose = require('mongoose');
const clubRegisterModel=new mongoose.Schema({
    club: {type: Object, required: true},
    registeruser:{type: Object, required: true},
},{
    timestamps:true,
});
const ClubRegister=mongoose.model('ClubRegister',clubRegisterModel);
module.exports=ClubRegister;