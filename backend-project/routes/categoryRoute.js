import express from "express";
import {
    registerCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.post('/register', registerCategory);
categoryRouter.get('/getAll', getAllCategory);
categoryRouter.get('/:categoryID', getCategoryById);
categoryRouter.put('/update/:categoryID', updateCategory);
categoryRouter.delete('/delete/:categoryID', deleteCategory);

export default categoryRouter;