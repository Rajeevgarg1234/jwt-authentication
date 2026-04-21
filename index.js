import express from "express";
import userRouter from "./routes/user.routes.js";
import db from '../db/index.js'
import { userTable  ,userSession } from "../db/schema.js";
import { eq } from "drizzle-orm";
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(async function (req,res,next) {
    const sessionId = req.headers['session-id'];
    if(!sessionId){
        return next();
    }

    const [data] = await db.select({
        id: userTable.id,
        sessionId: userSession.id,
        userId: userSession.userId,
        name: userTable.name,
        email: userTable.email,
    })
    .from(userSession)
    .rightJoin(userTable, eq(userTable.id,userSession.userId))
    .where((table) => eq(table.sessionId,sessionId));

        if(!data){
        return next();
    }

    req.user = data;
    next();
});

app.get("/",(req,res)=> {
    res.json({status: 'server is up and running'});
});

app.use('/user',userRouter);

app.listen(PORT, () => console.log(`server is running on the PORT ${PORT}`));
