import mongose from 'mongoose'
import colors from 'color'

// a mongoose stuf (mongoose.connect ....) return always a promise
const DB_connection = async ()=>{
    try{
        const connection = await mongose.connect(process.env.DATA_BASE,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            // useCreateIndex:true
        })
        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error){
        console.log(`Error  MongoDB not connected: ${error.message}`)
            process.exit(1)
    }
}

export default DB_connection