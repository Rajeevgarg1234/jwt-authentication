import express from "express";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { authentcationMiddleware , ensureAuthenticated } from "./middlewares/auth.middleware.js"
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authentcationMiddleware);

app.get("/",(req,res)=> {
    res.json({status: 'server is up and running'});
});

app.use('/user',userRouter);
app.use('/admin',adminRouter);

app.listen(PORT, () => console.log(`server is running on the PORT ${PORT}`));
