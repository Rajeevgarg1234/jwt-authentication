import express from "express"
import db from '../db/index.js'
import { userTable } from "../db/schema.js";
import { authentcationMiddleware , ensureAuthenticated , restrictToRole } from "../middlewares/auth.middleware.js";

const router = express.Router();


const adminRestrictMiddleware = restrictToRole('ADMIN'); // the middle restrict the route to only access to the admin

router.use(ensureAuthenticated);
router.use(adminRestrictMiddleware);

router.get('/users' , async (req,res) => {

    const users = await db.select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
    }).from(userTable);

    return res.json({ users });

});

export default router;