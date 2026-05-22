import Sales from "../models/salesModel.js";
import Medicine from "../models/medicineModel.js";

export async function registerSales(req, res) {
    try {
        const { medicineID, quantity_sold, totalAmount, salesDate } = req.body; // ✅ fixed

        const findSales = await Sales.findOne({ where: { medicineID, quantity_sold, totalAmount, salesDate } }); // ✅ fixed
        if (findSales) return res.status(400).json("sales already exists");

        const medicine = await Medicine.findByPk(medicineID); // ✅ fixed
        if (!medicine) return res.status(400).json("Medicine id doesn't exist");

        const sales = await Sales.create({ medicineID, quantity_sold, totalAmount, salesDate });
        res.status(201).json(sales); // ✅ fixed
    } catch (error) {
        console.error("error occured when registering sales", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getAllSales(req,res){
    try {
        const findSales= await Sales.findAll()
        if(!findSales) return res.status(400).json("No Sales found")
        res.status(200).json(findSales)
    } catch (error) {
        console.error("Error occured when getting all sales", error)
        res.status(500).json({error:error.message})
    }
}