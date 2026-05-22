import { useState, useEffect } from "react"
import api from "../api/api"

export default function InventoryStockForm() {
    const [medicineID, setMedicineID] = useState("")
    const [quantity_in_hand, setQuantityInHand] = useState("")
    const [expireDate, setExpireDate] = useState("")
    const [medicines, setMedicines] = useState([])
    const [inventoryList, setInventoryList] = useState([])

    useEffect(() => {
        fetchMedicines()
        fetchInventory()
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

    async function fetchInventory() {
        try {
            const response = await api.get('/invetory/getAll')
            setInventoryList(response.data)
        } catch (error) {
            console.error("Error occurred when fetching inventory", error)
            alert("Failed to fetch inventory stock")
        }
    }

    async function handleInventory(e) {
        e.preventDefault()
        try {
            await api.post('/invetory/register', { medicineID, quantity_in_hand, expireDate })
            alert("Inventory stock registered successfully")
            setMedicineID(""); setQuantityInHand(""); setExpireDate("")
            fetchInventory()
        } catch (error) {
            console.error("Error occurred when registering inventory stock", error)
            alert("Failed to register inventory stock")
        }
    }

    function isExpiringSoon(dateStr) {
        if (!dateStr) return false
        const exp = new Date(dateStr)
        const now = new Date()
        const diffDays = (exp - now) / (1000 * 60 * 60 * 24)
        return diffDays <= 90 && diffDays >= 0
    }

    function isExpired(dateStr) {
        if (!dateStr) return false
        return new Date(dateStr) < new Date()
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1 h-8 bg-teal-500 rounded-full" />
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Stock</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-4">Track medicine quantities and expiry dates</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-700 mb-5">➕ Add Stock Entry</h2>

                    <form onSubmit={handleInventory} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Medicine</label>
                            <select
                                required
                                value={medicineID}
                                onChange={(e) => setMedicineID(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            >
                                <option value="">Select Medicine</option>
                                {medicines.map((medicine) => (
                                    <option key={medicine.medicine_id} value={medicine.medicine_id}>
                                        {medicine.tradeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Quantity In Hand</label>
                            <input
                                type="number"
                                placeholder="e.g. 100"
                                required
                                value={quantity_in_hand}
                                onChange={(e) => setQuantityInHand(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Expire Date</label>
                            <input
                                type="date"
                                required
                                value={expireDate}
                                onChange={(e) => setExpireDate(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="md:col-span-3 pt-1">
                            <button
                                type="submit"
                                className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
                            >
                                Register Inventory Stock
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-700">Stock Records</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{inventoryList.length} entries</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Expired
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Expiring Soon
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-3 font-semibold">Medicine</th>
                                    <th className="text-left px-6 py-3 font-semibold">Qty In Hand</th>
                                    <th className="text-left px-6 py-3 font-semibold">Expire Date</th>
                                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inventoryList.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-slate-400 text-sm">
                                            No inventory records found.
                                        </td>
                                    </tr>
                                ) : (
                                    inventoryList.map((item) => {
                                        const expired = isExpired(item.expireDate)
                                        const expiringSoon = !expired && isExpiringSoon(item.expireDate)
                                        return (
                                            <tr key={item.inventory_id} className="hover:bg-slate-50 transition">
                                                <td className="px-6 py-4 font-medium text-slate-800">{item.medicineID}</td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono font-semibold text-slate-700">
                                                        {Number(item.quantity_in_hand).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{item.expireDate}</td>
                                                <td className="px-6 py-4">
                                                    {expired ? (
                                                        <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                            Expired
                                                        </span>
                                                    ) : expiringSoon ? (
                                                        <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                            Expiring Soon
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                            Valid
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}