import express from "express";
import userRouter from "./routes/user.routes.js";
import db from './db/index.js'
import { userTable  ,userSession } from "./db/schema.js";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken';
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(async function (req,res,next) {
    const tokenHeader = req.headers['authorization'];

    // Header authorization: Bearer <token>

    if(!tokenHeader){
        return next();
    }

    if(!tokenHeader.startsWith('Bearer')){
        return res.status(400).json({ error: 'authorization header must start with the header'});
    }

    const token = tokenHeader.split(' ')[1];

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decoded;
    next();
});

app.get("/",(req,res)=> {
    res.json({status: 'server is up and running'});
});

app.use('/user',userRouter);

app.listen(PORT, () => console.log(`server is running on the PORT ${PORT}`));
