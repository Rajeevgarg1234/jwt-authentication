import express from "express"
import db from '../db/index.js'
import { userTable } from "../db/schema.js";
import { authentcationMiddleware , ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/users', ensureAuthenticated , async (req,res) => {

    const users = await db.select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
    }).from(userTable);

    return res.json({ users });

});

export default router;