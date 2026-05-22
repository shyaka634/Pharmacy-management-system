import { useEffect, useState } from "react"
import api from "../api/api"

export default function InventoryReport() {
    const [report, setReport] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {
        const now = new Date()
        const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        setSelectedDate(currentDate)
        fetchInventoryReport(currentDate)
    }, [])

    async function fetchInventoryReport(date) {
        try {
            setLoading(true)
            const [medicineRes, inventoryRes, salesRes] = await Promise.all([
                api.get("/medicine/getAll"),
                api.get("/invetory/getAll"),
                api.get("/sales/getAll"),
            ])

            const medicines = medicineRes.data
            const inventory = inventoryRes.data
            const sales = salesRes.data

            const inventoryMap = {}
            inventory.forEach((item) => {
                inventoryMap[item.medicineID] = (inventoryMap[item.medicineID] || 0) + Number(item.quantity_in_hand)
            })

            const salesMap = {}
            sales.forEach((sale) => {
                if (sale.salesDate) {
                    const saleMonth = sale.salesDate.slice(0, 7)
                    if (saleMonth === date) {
                        salesMap[sale.medicineID] = (salesMap[sale.medicineID] || 0) + Number(sale.quantity_sold)
                    }
                }
            })

            const rows = medicines.map((medicine) => ({
                medicine_id: medicine.medicine_id,
                tradeName: medicine.tradeName,
                quantitySold: salesMap[medicine.medicine_id] ?? 0,
                remainingStock: inventoryMap[medicine.medicine_id] ?? 0,
            }))

            setReport(rows)
        } catch (error) {
            console.error("Failed to fetch inventory report:", error)
            alert("Failed to load report data")
        } finally {
            setLoading(false)
        }
    }

    function handleDateChange(e) {
        const date = e.target.value
        setSelectedDate(date)
        fetchInventoryReport(date)
    }

    const totalSold = report.reduce((sum, r) => sum + r.quantitySold, 0)
    const totalStock = report.reduce((sum, r) => sum + r.remainingStock, 0)
    const lowStock = report.filter((r) => r.remainingStock > 0 && r.remainingStock < 20).length
    const outOfStock = report.filter((r) => r.remainingStock === 0).length

    function getStockBadge(qty) {
        if (qty === 0) return <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Out of Stock</span>
        if (qty < 20) return <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">Low Stock</span>
        return <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">In Stock</span>
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1 h-8 bg-teal-500 rounded-full" />
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory & Sales Report</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-4">Monthly overview of sales performance and stock levels</p>
                </div>

                {/* Month Picker */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-600">Reporting Period:</label>
                        <input
                            type="month"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                        />
                    </div>
                    {!loading && (
                        <p className="text-xs text-slate-400 ml-auto">{report.length} medicines • Last updated just now</p>
                    )}
                </div>

                {/* Summary Stats */}
                {!loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <p className="text-xs text-slate-500 mb-1">Total Medicines</p>
                            <p className="text-2xl font-bold text-slate-800">{report.length}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <p className="text-xs text-slate-500 mb-1">Units Sold (Month)</p>
                            <p className="text-2xl font-bold text-teal-600">{totalSold.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <p className="text-xs text-slate-500 mb-1">Total Stock</p>
                            <p className="text-2xl font-bold text-slate-800">{totalStock.toLocaleString()}</p>
                        </div>
                        <div className={`rounded-xl p-4 shadow-sm ${outOfStock > 0 ? 'bg-red-500' : lowStock > 0 ? 'bg-amber-500' : 'bg-teal-500'}`}>
                            <p className="text-xs text-white/80 mb-1">Stock Alerts</p>
                            <p className="text-2xl font-bold text-white">
                                {outOfStock > 0 ? `${outOfStock} Out` : lowStock > 0 ? `${lowStock} Low` : 'All Good'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Report Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-base font-semibold text-slate-700">Medicine-wise Report</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Sales and stock for selected month</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="text-left px-6 py-3 font-semibold">#</th>
                                    <th className="text-left px-6 py-3 font-semibold">Trade Name</th>
                                    <th className="text-left px-6 py-3 font-semibold">Qty Sold</th>
                                    <th className="text-left px-6 py-3 font-semibold">Remaining Stock</th>
                                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <svg className="animate-spin w-6 h-6 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                <span className="text-sm">Loading report…</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : report.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-400 text-sm">
                                            No records found for this period.
                                        </td>
                                    </tr>
                                ) : (
                                    report.map((row, index) => (
                                        <tr key={row.medicine_id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800">{row.tradeName}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-semibold text-teal-700">
                                                    {row.quantitySold.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-semibold text-slate-700">
                                                    {row.remainingStock.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{getStockBadge(row.remainingStock)}</td>
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