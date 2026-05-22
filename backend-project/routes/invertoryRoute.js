import express from "express";
import {registerInvetory, getAllInvetory} from '../controllers/invetoryStockController.js'
const inventoryRouter= express.Router()

inventoryRouter.post('/register', registerInvetory)
inventoryRouter.get('/getAll', getAllInvetory)

export default inventoryRouter;
