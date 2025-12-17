import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


const userSchema =  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    refreshToken:{
        type:String
    },
    resettoken:{
        type:String,
        default:"",
    }
},{timestamps:true})


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.ispasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
} 

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_EXPIRY}
        
    )
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            password : this.password,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_EXPIRY}
        
    )
}
export const User = mongoose.model('User',userSchema)

