import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import categorySchema from "./categoryModel.js";

const medicineSchema= sequelize.define("Medicine",{
    medicine_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    categoryID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'category',
            key:'category_id'
        }
    },

    tradeName:{
        type:DataTypes.STRING,
        allowNull:false,
       
    },
    genericName:{
        type:DataTypes.STRING,
        allowNull:false,
      
    },
    unitPrice:{
        type:DataTypes.INTEGER,
        allowNull:false,
       
    },
},{tableName:"medicine"})

medicineSchema.belongsTo(categorySchema,{foreignKey:"categoryID", onDelete:"CASCADE", onUpdate:"CASCADE"})
categorySchema.hasMany(medicineSchema,{foreignKey:"categoryID"})

export default medicineSchema;