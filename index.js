import path from "path"
import express from "express"
import mongose from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"
import { config } from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";



config()
const DB_connection = async ()=>{
    try{
        const connection = await mongose.connect(process.env.DATA_BASE,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            // useCreateIndex:true
        })
        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error){
        console.log(`Error: ${error.message}`)
            process.exit(1)
    }
}

DB_connection()

const app = express()
if (process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

app.use(express.json())

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.get("/api/config/paypal", (req, res) =>
    res.send(process.env.CLIENT_ID)
  );

const __dirname = path.resolve()

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/build")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"/frontend/build"))
    })
}else{
    app.get("/", (req,res)=>{
        res.send("API is Running.....")
    })
}

app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 8000
app.listen(PORT,console.log(`App is running in ${PORT}`))