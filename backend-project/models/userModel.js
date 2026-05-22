import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const userSchema= sequelize.define("User",{
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{tableName:"user"})

export default userSchema;