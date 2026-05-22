import Medicine from "../models/medicineModel.js";
import Catagory from "../models/categoryModel.js";


export async function registerMedicine(req,res){
    try {
        const{categoryID,tradeName,genericName,unitPrice}= req.body;
        const findMedicine= await Medicine.findOne({where:{tradeName, categoryID}})
        if(findMedicine) return res.status(400).json("Medicine Already exists");
        const findCategory= await Catagory.findByPk(categoryID)
        if(!findCategory) return res.status(400).json("invalid category");
        const medicine= await Medicine.create({categoryID,tradeName,genericName,unitPrice})
        res.status(201).json(medicine);
    } catch (error) {
        console.error("error occured when registering category", error)
        res.status(500).json({error:error.message})
    }
}
export async function getAllMedicine(req,res){
    try {
        const allMedicine= await Medicine.findAll();
        if(!allMedicine) return res.status(400).json("Invalid medicine")
        res.status(200).json(allMedicine)
    } catch (error) {
        console.error("Error occured when getting all medicines", error)
        res.status(500).json({error:error.message})
    }
}
export async function getMedicineById(req,res){
    try {
        const{medicine_id}= req.params;
        const medicine= await Medicine.findByPk(medicine_id);
        if(!medicine) return res.status(400).json("Invalid medicine id");
        res.status(200).json(medicine)
    } catch (error) {
        console.error("Error occured when getting medicine by id", error)
        res.status(500).json({error:error.message})
    }
}

export async function updateMedicine(req, res) {
    try {
        const { medicine_id } = req.params;
        const { categoryID, tradeName, genericName, unitPrice } = req.body;

        const medicine = await Medicine.findByPk(medicine_id);
        if (!medicine) return res.status(404).json({ error: "Invalid medicine id" });

        const category = await Catagory.findByPk(categoryID);
        if (!category) return res.status(404).json({ error: "Invalid category id" });

        const updatedMedicine = await medicine.update({ categoryID, tradeName, genericName, unitPrice });
        res.status(200).json(updatedMedicine);
    } catch (error) {
        console.error("error occurred when updating medicine", error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteMedicine(req,res){
    try {
        const {medicine_id}= req.params;
        const medicine= await Medicine.findByPk(medicine_id)
        if(!findMedicine) return res.status(404).json("invalid medicine id")
        await medicine.destroy()
        res.status(200).json("Medicine deleted successfully");
    } catch (error) {
        console.error("error occured when deleting medicine", error)
        res.status(500).json({error:error.message})
    }
}

