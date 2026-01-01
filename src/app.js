import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
export const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174',
        'https://kuber-biotech-project-frontend-5akyd3f53-digitos-it-solutions.vercel.app'
    ],
    credentials: true
}));

//Broucher Router
import broucherRouter from "./routes/broucher.routes.js"
app.use("/api/broucher",broucherRouter)

//User Router
import userRouter from "./routes/user.routes.js"
app.use('/api/users',userRouter)

//Product Router
import productRouter from "./routes/product.routes.js"
app.use("/api/products",productRouter)

//Contact Router
import contactRouter from "./routes/contact.routes.js"
app.use("/api/contacts",contactRouter)
