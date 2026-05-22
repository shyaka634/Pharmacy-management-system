import { useState, useEffect } from 'react'
import api from '../api/api'

export default function CategoryForm() {
    const [categoryName, setCategoryName] = useState("")
    const [storageInstruction, setStorageInstruction] = useState("")
    const [category, setCategory] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const response = await api.get('/category/getAll');
            setCategory(response.data);
        } catch (error) {
            console.error("Error Occured when fetchingCategories")
            alert("Failed to fetch categories");
        }
    }

    async function handleCategory(e) {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(`/category/update/${editingId}`, {
                    category_name: categoryName,
                    storage_instructions: storageInstruction
                });

                alert("Category updated successfully");
                setEditingId(null);

            } else {
                await api.post('/category/register', {
                    category_name: categoryName,
                    storage_instructions: storageInstruction
                });

                alert("Category registered successfully");
            }

            setCategoryName("");
            setStorageInstruction("");
            fetchCategories();

        } catch (error) {
            console.log("Error occured when saving category", error);
            alert("failed to save category");
        }
    }

    function handleEdit(cat) {
        setEditingId(cat.category_id);
        setCategoryName(cat.category_name);
        setStorageInstruction(cat.storage_instructions);
    }

    async function handleDelete(category_id) {
        if (!window.confirm("Are you sure you want to delete this category record?")) return;

        try {
            await api.delete(`/category/delete/${category_id}`);
            alert("Category deleted successfully");
            fetchCategories();

        } catch (error) {
            console.log("Error deleting category", error);
            alert("Failed to delete category");
        }
    }

    function handleCancelEdit() {
        setEditingId(null);
        setCategoryName("");
        setStorageInstruction("");
    }

    return (
        <div>
            <div>

                {/* Page Header */}
                <div>
                    <div>
                        <div />
                        <h1>
                            Medicine Categories
                        </h1>
                    </div>

                    <p>
                        Manage category classifications and storage instructions
                    </p>
                </div>

                {/* Form Card */}
                <div>
                    <div>
                        <h2>
                            {editingId ? "✏️ Edit Category" : "➕ New Category"}
                        </h2>

                        {editingId && (
                            <span>
                                Editing mode
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleCategory}>
                        <div>
                            <label>Category Name</label>

                            <input
                                type="text"
                                placeholder="e.g. Antibiotics"
                                required
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Storage Instruction</label>

                            <input
                                type="text"
                                placeholder="e.g. Store below 25°C"
                                required
                                value={storageInstruction}
                                onChange={(e) => setStorageInstruction(e.target.value)}
                            />
                        </div>

                        <div>
                            <button type="submit">
                                {editingId ? "Update Category" : "Register Category"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div>
                    <div>
                        <h3>Category Records</h3>

                        <p>
                            {category.length} categories registered
                        </p>
                    </div>

                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Storage Instructions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {category.length === 0 ? (
                                    <tr>
                                        <td colSpan="3">
                                            No categories found. Register one above.
                                        </td>
                                    </tr>
                                ) : (
                                    category.map((cat) => (
                                        <tr key={cat.category_id}>
                                            <td>{cat.category_name}</td>

                                            <td>{cat.storage_instructions}</td>

                                            <td>
                                                <div>
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(cat.category_id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}