import express from "express";
import {registerMedicine, getAllMedicine, getMedicineById,updateMedicine, deleteMedicine} from '../controllers/medicineController.js'
const medicineRouter= express.Router()
medicineRouter.post('/register', registerMedicine)
medicineRouter.get('/getAll', getAllMedicine)
medicineRouter.get('/:medicine_id', getMedicineById)
medicineRouter.put('/update/:medicine_id', updateMedicine)
medicineRouter.delete('/delete/:medicine_id', deleteMedicine)

export default medicineRouter;