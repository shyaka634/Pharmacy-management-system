import { useState, useEffect } from 'react'
import api from '../api/api'

export default function MedicineForm() {
    const [tradeName, setTradeName] = useState("")
    const [genericName, setGenericName] = useState("")
    const [unitPrice, setUnitPrice] = useState("")
    const [categoryID, setCategoryID] = useState("")
    const [categories, setCategories] = useState([])
    const [medicines, setMedicines] = useState([])
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchMedicines()
        fetchCategories()
    }, [])

    async function fetchMedicines() {
        try {
            const response = await api.get('/medicine/getAll')
            setMedicines(response.data)
        } catch (error) {
            console.error("Error occurred when fetching medicines", error)
            alert("Failed to fetch medicines")
        }
    }

    async function fetchCategories() {
        try {
            const response = await api.get('/category/getAll')
            setCategories(response.data)
        } catch (error) {
            console.error("Error occurred when fetching categories", error)
            alert("Failed to fetch categories")
        }
    }

    async function handleMedicine(e) {
        e.preventDefault()
        try {
            if (editingId) {
                await api.put(`/medicine/update/${editingId}`, {
                    category_id: categoryID,      // ✅ fixed
                    trade_name: tradeName,         // ✅ fixed
                    generic_name: genericName,     // ✅ fixed
                    unit_price: unitPrice          // ✅ fixed
                })
                alert("Medicine updated successfully")
                setEditingId(null)
            } else {
                await api.post('/medicine/register', {
                    category_id: categoryID,      // ✅ fixed
                    trade_name: tradeName,         // ✅ fixed
                    generic_name: genericName,     // ✅ fixed
                    unit_price: unitPrice          // ✅ fixed
                })
                alert("Medicine registered successfully")
            }
            setTradeName(""); setGenericName(""); setUnitPrice(""); setCategoryID("")
            fetchMedicines()
        } catch (error) {
            console.error("Error occurred when saving medicine", error)
            alert("Failed to save medicine")
        }
    }

    function handleEdit(medicine) {
        setEditingId(medicine.medicine_id)
        setTradeName(medicine.trade_name)         // ✅ fixed
        setGenericName(medicine.generic_name)     // ✅ fixed
        setUnitPrice(medicine.unit_price)         // ✅ fixed
        setCategoryID(medicine.category_id)       // ✅ fixed
    }

    async function handleDelete(medicine_id) {
        if (!window.confirm("Are you sure you want to delete this medicine record?")) return
        try {
            await api.delete(`/medicine/delete/${medicine_id}`)
            alert("Medicine deleted successfully")
            fetchMedicines()
        } catch (error) {
            console.error("Error deleting medicine", error)
            alert("Failed to delete medicine")
        }
    }

    function handleCancelEdit() {
        setEditingId(null)
        setTradeName(""); setGenericName(""); setUnitPrice(""); setCategoryID("")
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1 h-8 bg-teal-500 rounded-full" />
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Medicine Registry</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-4">Add and manage medicine records with pricing and classification</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-slate-700">
                            {editingId ? "✏️ Edit Medicine" : "➕ New Medicine"}
                        </h2>
                        {editingId && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                                Editing mode
                            </span>
                        )}
                    </div>

                    <form onSubmit={handleMedicine} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Category</label>
                            <select
                                required
                                value={categoryID}
                                onChange={(e) => setCategoryID(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}  {/* ✅ fixed */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Trade Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Amoxil"
                                required
                                value={tradeName}
                                onChange={(e) => setTradeName(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Generic Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Amoxicillin"
                                required
                                value={genericName}
                                onChange={(e) => setGenericName(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Unit Price (RWF)</label>
                            <input
                                type="number"
                                placeholder="e.g. 500"
                                required
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 pt-1">
                            <button
                                type="submit"
                                className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
                            >
                                {editingId ? "Update Medicine" : "Register Medicine"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold px-6 py-2.5 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-700">Medicine Records</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{medicines.length} medicines registered</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-3 font-semibold">Trade Name</th>
                                    <th className="text-left px-6 py-3 font-semibold">Generic Name</th>
                                    <th className="text-left px-6 py-3 font-semibold">Unit Price</th>
                                    <th className="text-left px-6 py-3 font-semibold">Category</th>
                                    <th className="text-left px-6 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {medicines.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-400 text-sm">
                                            No medicines found. Register one above.
                                        </td>
                                    </tr>
                                ) : (
                                    medicines.map((medicine) => (
                                        <tr key={medicine.medicine_id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-medium text-slate-800">{medicine.trade_name}</td>        {/* ✅ fixed */}
                                            <td className="px-6 py-4 text-slate-600">{medicine.generic_name}</td>                  {/* ✅ fixed */}
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-teal-700 font-semibold">
                                                    {Number(medicine.unit_price).toLocaleString()} RWF                             {/* ✅ fixed */}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {/* ✅ Show category name by looking up from categories list */}
                                                    {categories.find(c => c.category_id === medicine.category_id)?.category_name || medicine.category_id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(medicine)}
                                                        className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(medicine.medicine_id)}
                                                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition"
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
    )
}