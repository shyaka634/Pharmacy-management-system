import express from "express";
import {registerUser, loginUser, logoutUser, verifyUser} from '../controllers/authController.js'
import { isAuth } from "../middleware/authMiddleware.js";
const userRouter= express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.delete('/logout', logoutUser)
userRouter.post('/verify', verifyUser)

userRouter.get('/dashboard', isAuth,(req,res)=>{
    res.json({message:"Access granted"});
})

export default userRouter;