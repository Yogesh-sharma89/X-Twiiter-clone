import {Schema,model} from 'mongoose';

const notificationSchema = new Schema({

    from:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        enum:['follow','like','comment'],
        required:true
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        default:null
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:'Comment',
        default:null
    }

},{timestamps:true})


const Notification = model('Notification',notificationSchema);

export default Notification;