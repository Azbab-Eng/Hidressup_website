import path, { dirname } from "path"
import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import { config } from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors"
import { fileURLToPath } from "url"



config()
const DB_connection = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.DATA_BASE,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            // useCreateIndex:true
        })
        console.log(`MongoDB connected: ${connection.connection.host} `)
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
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use('/uploads',
    express.static(path.join(__dirname,'./uploads')))

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.get("/config/paypal", (req, res) =>
    res.send(process.env.CLIENT_ID)
  );

  
// const __dirname = path.resolve()

if(process.env.NODE_ENV === "production"){
   app.get("/", (req,res)=>{
        res.send("API is Running..... on PRODUCTION MODE")
    })
}else{
    app.get("/", (req,res)=>{
        res.send("API is Running..... on DEVELOPMENT MODE")
    })
}

app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 8000
app.listen(PORT,console.log(`App is running in ${PORT}`))