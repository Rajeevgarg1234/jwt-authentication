import express from "express"
import db from '../db/index.js'
import { userTable  ,userSession } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomBytes,createHmac } from "node:crypto";
import jwt from 'jsonwebtoken';
import { authentcationMiddleware , ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/',ensureAuthenticated ,async (req,res) =>{
    return res.json({user});
});

router.patch('/', ensureAuthenticated, async (req,res)=>{

    const { name } = req.body;
    
});

router.post('/signup', async (req,res) =>{
const { name, email, password ,role } = req.body;

const salt = randomBytes(256).toString('hex');
const hashedPassword = createHmac('sha256',salt).update(password).digest('hex');

// if const [existingUser] = result , then this is equivalent to const existingUser  = result[0]; 
 
const [existingUser] = await db 
.select({email: userTable.email})  // the select query is always return an array, so we need to destructure the existingUser
.from(userTable)    
.where((table) => eq(table.email,email));

if(existingUser){
    return res.status(400).json({error: ` user with this ${email} already exist`});
}

const [user] = await db.insert(userTable).values({
    name,
    email,
    role,
    password : hashedPassword,
    salt
}).returning({ id: userTable.id }); // returns an array

return res.status(201).json({ status: 'sucess', data: {user_id: user.id}});


});
router.post('/login', async (req,res) =>{
    const { email , password } = req.body;
    if(!email) return res.status(404).json({error: 'kindly enter the registered email'});
    if(!password) return res.status(404).json({error: 'kindly enter the password created during signup'});

    const [user] = await db 
    .select({
        id: userTable.id,
        email: userTable.email,
        role: userTable.role,
        name: userTable.name,
        password: userTable.password,
        salt: userTable.salt
    })  
    .from(userTable)    
    .where((table) => eq(table.email,email));

    if(!user){
        return res.status(401).json({ error: 'this email is not registered ! kindly signup'});
    }

    const userHashedPassword = createHmac('sha256',user.salt).update(password).digest('hex');


    if(userHashedPassword !== user.password){
        return res.status(404).json({error: `wrong password`})
    }
    const payload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({status: 'sucess' , token});

});

export default router;