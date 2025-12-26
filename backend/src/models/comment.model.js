import {Schema,model} from 'mongoose';

const commentSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        required:true,
        index:true
    },
    content:{
        type:String,
        maxLength:200,
        required:true
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
        
        }
    ],
    dislikes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
        
        }
    ],

    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
        index: true,
    },

    replyToUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    replyDepth:{
        type:Number,
        default:0,
        max:5
    },
    repliesCount: {
        type: Number,
        default: 0,
    },

    isDeleted:{
        type:Boolean,
        default:false
    }


},{timestamps:true})


const Comment = model('Comment',commentSchema);

export default Comment;
