import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const categorySchema= sequelize.define("Category",{
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    category_name:{
        type:DataTypes.STRING,
        allowNull:false,
     
    },
    storage_instructions:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{tableName:"category"})

export default categorySchema;