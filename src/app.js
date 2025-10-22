import express from "express"
import cookieParser from "cookie-parser"

export const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


//User Router
import userRouter from "./routes/user.routes.js"
app.use('/api/v1/users',userRouter)

//Product Router
import productRouter from "./routes/product.routes.js"
app.use("/api/v1/products",productRouter)

//Cart Router
import cartRouter from "./routes/cart.routes.js"
app.use("/api/v1/carts",cartRouter)

//Categories Router
import cartegoryRouter from "./routes/categories.route.js"
app.use("/api/v1/category",cartegoryRouter)

//Review Router
import reviewRouter from './routes/review.routes.js'
app.use('/api/v1/review',reviewRouter)

//Order Router
import OrderRouter from "./routes/order.routes.js"
app.use("/api/v1/order",OrderRouter)