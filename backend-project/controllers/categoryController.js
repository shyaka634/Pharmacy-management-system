import Category from "../models/categoryModel.js";

export async function registerCategory(req, res) {
    try {
        const { category_name, storage_instructions } = req.body;
        const findCategory = await Category.findOne({ where: { category_name } });
        if (findCategory) return res.status(400).json("Category Already exists");
        const category = await Category.create({ category_name, storage_instructions });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error Occured when registering category", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getAllCategory(req, res) {
    try {
        const category = await Category.findAll();
        res.status(200).json(category);
    } catch (error) {
        console.error("Error occured when getting all categories", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getCategoryById(req, res) {
    try {
        const { categoryID } = req.params;
        const category = await Category.findByPk(categoryID);
        if (!category) return res.status(400).json("Category id doesn't exist");
        res.status(200).json(category);
    } catch (error) {
        console.error("Error occured when getting category by id", error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateCategory(req, res) {
    try {
        const { categoryID } = req.params;
        const { category_name, storage_instructions } = req.body;
        const category = await Category.findByPk(categoryID);
        if (!category) return res.status(400).json("invalid category id");
        const updatedCategory = await category.update({ category_name, storage_instructions });
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error occured when updating category", error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteCategory(req, res) {
    try {
        const { categoryID } = req.params;
        const category = await Category.findByPk(categoryID);
        if (!category) return res.status(400).json("invalid category id");
        await category.destroy();
        res.status(200).json("Deleted category successfully");
    } catch (error) {
        console.error("Error occured when deleting category", error);
        res.status(500).json({ error: error.message });
    }
}