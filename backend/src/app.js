import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import ConnectToDb from './config/db.js';
import userRoutes from './routes/user.js';
import cors from 'cors';

dotenv.config();

const app = express();

const port  = process.env.PORT || 3000;

app.use(express.json());
app.use(clerkMiddleware())
app.use(cors());



const StartConnection = async ()=>{
    try{
        await ConnectToDb();

        app.listen(port,()=>{
            console.log('Server is up and listening at 3000 👍⚡')
        })

    }catch(err){
        console.log('Error in main server file : '+err);
        process.exit(1)
    }
}

StartConnection();

app.get('/',(req,res)=>{
    return res.json({message:'Server is up and running properly'})
})

app.use('/api/user',userRoutes)