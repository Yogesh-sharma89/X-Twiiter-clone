import {Schema,model} from 'mongoose';

const followSchema = new Schema ({
    followerId:{
        type:Schema.Types.ObjectId,
        required:true,
        index:true,
        unique:true,
        ref:'User'
    },
    followingId:{
        type:Schema.Types.ObjectId,
        required:true,
        index:true,
        unique:true,
        ref:'User'
    }
},{timestamps:true})

const Follow = model('Follow',followSchema);

export default Follow;