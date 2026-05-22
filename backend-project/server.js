import express from "express";
import session from "express-session";
import cors from 'cors';
import categoryRouter from "./routes/categoryRoute.js";
import inventoryRouter from "./routes/invertoryRoute.js";
import medicineRouter from "./routes/medicineRoute.js";
import salesRouter from "./routes/salesRoute.js";
import userRouter from "./routes/userRoute.js";
import sequelize, { connectDb } from "./config/db.js";

const app = express();
connectDb();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(session({
    secret: "my banana plantation",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false }
}));

app.use('/api/auth', userRouter);
app.use('/api/sales', salesRouter);
app.use('/api/category', categoryRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/invetory', inventoryRouter);

import categorySchema from "./models/categoryModel.js";
import invetoryStockSchema from "./models/invetoryStockModel.js";
import medicineSchema from "./models/medicineModel.js";
import salesSchema from "./models/salesModel.js";
import userSchema from "./models/userModel.js";

sequelize.sync({ alter: true });
console.log("Database synced");

app.listen(1000, () => {
    console.log("Listening to port 1000");
});