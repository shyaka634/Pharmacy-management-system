import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import medicineSchema from "./medicineModel.js";

const salesSchema= sequelize.define("Sales",{
    salesNumber:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    medicineID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"medicine",
            key:"medicine_id"
        },
    },
    quantity_sold:{
        type:DataTypes.INTEGER,
        allowNull:false,
     
    },
    totalAmount:{
        type:DataTypes.INTEGER,
        allowNull:false,
       
    },
    salesDate:{
        type:DataTypes.DATE,
        allowNull:false,
       
    },
},{tableName:'sales' ,timestamps:true})

salesSchema.belongsTo(medicineSchema,{foreignKey:"medicineID", onDelete:"CASCADE", onUpdate:"CASCADE"})
medicineSchema.hasMany(salesSchema,{foreignKey:"medicineID"})

export default salesSchema;