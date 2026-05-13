import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
 username:{type:String,required:true,unique:true,trim:true,lowercase:true},
 email:{type:String,unique:true,sparse:true,trim:true,lowercase:true},
 password:{type:String,required:true}, firstName:{type:String,required:true}, lastName:{type:String,required:true},
 bio:{type:String,default:""}, avatarColor:{type:String,default:"#3949ab"},
 postsCount:{type:Number,default:0}, joinedCount:{type:Number,default:0}, acceptedCount:{type:Number,default:0}
},{timestamps:true});
export default mongoose.model("User",userSchema);
