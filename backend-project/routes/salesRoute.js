import express from "express";
import {registerSales, getAllSales} from '../controllers/salesController.js'
const salesRouter= express.Router()

salesRouter.post('/register', registerSales)
salesRouter.get('/getAll', getAllSales)

export default salesRouter;