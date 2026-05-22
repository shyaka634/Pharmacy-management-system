import { Sequelize } from "sequelize";

const sequelize= new Sequelize("PIMS", "root", "",{
    host:"localhost",
    dialect:"mysql",
    port:3307
})

export async function connectDb(){
    try {
    sequelize.authenticate()
    console.log("Connected to db successfully");   
    } catch (error) {
        console.error("Failed to connect to db", error)
    }
}

export default sequelize;