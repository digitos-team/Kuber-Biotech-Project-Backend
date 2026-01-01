import { connectDB } from "./db/connection.js"
import { app } from "./app.js"

const PORT = process.env.PORT || 3000;
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running On ${PORT}`);
    })
}).catch((err)=>console.log(err))