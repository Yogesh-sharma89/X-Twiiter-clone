import {Schema,model} from 'mongoose';

const postSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    content:{
        type:String,
        maxLength:500,
        required:true
    },
    media:[
        {
            type:{
                type:String,
                enum:['image','video']
            },
            url:String
        }
    ],
    likesCount:{
        type:Number,
        default:0
    },
    dislikeCount:{
        type:Number,
        default:0
    },
    commentCount:{
        type:Number,
        default:0
    },
    visibility:{
        type:String,
        enum:['public','private','followers'],
        default:'public'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

postSchema.pre('validate',function(next){
    if(!this.content && this.media.length===0){
        return next(new Error('Post must have either content or media ( image , video)'))
    }
    next()
})

const Post = model('Post',postSchema);

export default Post;