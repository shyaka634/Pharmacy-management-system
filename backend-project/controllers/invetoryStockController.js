import Invetory from "../models/invetoryStockModel.js";
import Medicine from "../models/medicineModel.js";

export async function registerInvetory(req, res) {
    try {
        const { medicineID, quantity_in_hand, expireDate } = req.body;

        const findInvetory = await Invetory.findOne({ where: { medicineID } }); // ✅ fixed
        if (findInvetory) return res.status(400).json("Invetory Stock Already exists"); // ✅ fixed

        const medicine = await Medicine.findByPk(medicineID); // ✅ fixed
        if (!medicine) return res.status(400).json("Invalid medicine id");

        const invetory = await Invetory.create({ medicineID, quantity_in_hand, expireDate });
        res.status(201).json(invetory);
    } catch (error) {
        console.error("error occured when registering invetory stock", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getAllInvetory(req,res){
    try {
        const getInvetory= await Invetory.findAll()
        if(!getInvetory) return res.status(400).json("No Invetory found")
        res.status(200).json(getInvetory)
    } catch (error) {
        console.error("Error occured when getting all invetory", error)
        res.status(500).json({error:error.message})
    }
}