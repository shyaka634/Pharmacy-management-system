import User from "../models/userModel.js";
import bcrypt from 'bcrypt'

export async function registerUser(req,res){
    try {
        const{username, password}= req.body;
        const findUser= await User.findOne({where:{username}})
        if(findUser) return res.status(400).json("User Already exists");
        const hashed= await bcrypt.hash(password, 10);
        const user= await User.create({username, password:hashed})
        res.status(201).json(user);
    } catch (error) {
        console.error("Error occured when registering user",error)
        res.status(500).json({error:error.message})
    }
}

export async function loginUser(req,res){
    try {
        const{username, password}= req.body;
        const user= await User.findOne({where:{username}})
        if(!user) return res.status(400).json("Invalid username")
        const unhash= await bcrypt.compare(password, user.password)
        req.session.userId= user.user_id;
        res.status(200).json("logged in successfully");
    } catch (error) {
        console.error("Error occured when logging in user",error)
        res.status(500).json({error:error.message})
    }
}

export async function logoutUser(req,res){
    try {
        req.session.destroy(err =>{
            if(err) return res.status(400).json("Failed to logout")
            res.status(200).json("loggedout successfully")
        })
    } catch (error) {
        console.error("error occured when logging out",error)
        res.status(500).json({error:error.message})
    }
}

export async function verifyUser(req,res){
    try {
        if(req.session.userId && req.session) {
            return res.status(200).json({authenticated:true})
        }else{
            res.status(400).json({authenticated:false})
        }
    } catch (error) {
        console.error("error occured when verifying user", error)
        res.status(500).json({authenticated:false})
    }
}