import mongoose from "mongoose";
const miniUser={username:String,firstName:String,lastName:String,bio:String,avatarColor:String};
const callSchema=new mongoose.Schema({user:miniUser,note:{type:String,default:""},status:{type:String,enum:["pending","accepted","declined"],default:"pending"}},{timestamps:true});
const postSchema=new mongoose.Schema({body:{type:String,required:true},category:{type:String,default:"other"},slots:{type:Number,required:true,min:1},remainingSlots:{type:Number,required:true,min:0},author:miniUser,calls:[callSchema]},{timestamps:true});
export default mongoose.model("Post",postSchema);
