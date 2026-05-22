import { useState, useEffect } from "react"
import api from "../api/api"

export default function SalesForm() {
    const [medicineID, setMedicineID] = useState("")
    const [quantity_sold, setQuantitySold] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const [salesDate, setSalesDate] = useState("")
    const [medicines, setMedicines] = useState([])
    const [salesList, setSalesList] = useState([])

    useEffect(() => {
        fetchMedicines()
        fetchSales()
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

    async function fetchSales() {
        try {
            const response = await api.get('/sales/getAll')
            setSalesList(response.data)
        } catch (error) {
            console.error("Error occurred when fetching sales", error)
            alert("Failed to fetch sales")
        }
    }

    async function handleSales(e) {
        e.preventDefault()
        try {
            await api.post('/sales/register', { medicineID, quantity_sold, totalAmount, salesDate })
            alert("Sales registered successfully")
            setMedicineID(""); setQuantitySold(""); setTotalAmount(""); setSalesDate("")
            fetchSales()
        } catch (error) {
            console.error("Error occurred when registering sales", error)
            alert("Failed to register sales")
        }
    }

    const totalRevenue = salesList.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0)
    const totalUnitsSold = salesList.reduce((sum, s) => sum + Number(s.quantity_sold || 0), 0)

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1 h-8 bg-teal-500 rounded-full" />
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sales Management</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-4">Record and monitor medicine sales transactions</p>
                </div>

                {/* Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Total Transactions</p>
                        <p className="text-2xl font-bold text-slate-800">{salesList.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Units Sold</p>
                        <p className="text-2xl font-bold text-teal-600">{totalUnitsSold.toLocaleString()}</p>
                    </div>
                    <div className="bg-teal-500 rounded-xl p-4 shadow-sm md:col-span-2">
                        <p className="text-xs text-teal-100 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()} RWF</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-700 mb-5">➕ Record Sale</h2>

                    <form onSubmit={handleSales} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            <label className="text-sm font-medium text-slate-600">Quantity Sold</label>
                            <input
                                type="number"
                                placeholder="e.g. 10"
                                required
                                value={quantity_sold}
                                onChange={(e) => setQuantitySold(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Total Amount (RWF)</label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                required
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-600">Sales Date</label>
                            <input
                                type="date"
                                required
                                value={salesDate}
                                onChange={(e) => setSalesDate(e.target.value)}
                                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                            />
                        </div>

                        <div className="md:col-span-2 pt-1">
                            <button
                                type="submit"
                                className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
                            >
                                Register Sale
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-700">Sales Records</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{salesList.length} transactions recorded</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-3 font-semibold">#</th>
                                    <th className="text-left px-6 py-3 font-semibold">Medicine</th>
                                    <th className="text-left px-6 py-3 font-semibold">Qty Sold</th>
                                    <th className="text-left px-6 py-3 font-semibold">Total Amount</th>
                                    <th className="text-left px-6 py-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salesList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-400 text-sm">
                                            No sales recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    salesList.map((sale, index) => (
                                        <tr key={sale.salesNumber} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800">{sale.medicineID}</td>
                                            <td className="px-6 py-4 text-slate-600">{sale.quantity_sold}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-semibold text-teal-700">
                                                    {Number(sale.totalAmount).toLocaleString()} RWF
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{sale.salesDate}</td>
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