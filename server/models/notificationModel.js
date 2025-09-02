const mongoose= require('mongoose');
const notificationModel= new mongoose.Schema(
    {
        user:{type:Object,required:true},
        text:{type:String,required:true},
        isPast:{type:Boolean, default:false},
    }
)
const Notifications=mongoose.model('Notifications',notificationModel);
module.exports=Notifications;