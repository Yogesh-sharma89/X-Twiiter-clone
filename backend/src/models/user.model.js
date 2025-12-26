import {Schema,model} from 'mongoose'

const userSchema = new Schema({

    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
    
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true
    },
     clerkId:{
        type:String,
        required:true,
        unique:true
     },
     imageUrl:{
        type:String,
        required:true,
        default:''
     },
     postCount:{
      type:Number,
      default:0
     },
     username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
     },
     bannerImage:{
        type:String,
        default:''
     },
     bio:{
        type:String,
        default:'',
        maxLength:200
     },
     location:{
        type:String,
        default:''
     },
     followers:{
      type:Number,
      default:0
     },
     following:{
      type:Number,
      default:0
     },
     accountStatus:{
      type:String,
      enum:['active','deleted'],
      default:'active'
     },

     deletedAt:{
      type:Date,
     }

},{timestamps:true})

const User = model('User',userSchema);

export default User;