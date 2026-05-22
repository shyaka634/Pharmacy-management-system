import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import medicineSchema from "./medicineModel.js";

const invetoryStockSchema= sequelize.define("Invetory",{
    stockNumber:{
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
            key:"medicine_id",
        },
    },

    quantity_in_hand:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    expireDate:{
        type:DataTypes.DATE,
        allowNull:false,
        
    },
},{tableName:'invetory',timestamps:true})

invetoryStockSchema.belongsTo(medicineSchema,{foreignKey:"medicineID", onDelete:"CASCADE", onUpdate:"CASCADE"})
medicineSchema.hasMany(invetoryStockSchema,{foreignKey:"medicineID"})

export default invetoryStockSchema;