import { getAuth, requireAuth } from "@clerk/express";

export const protectedRoute = [
    requireAuth(),

    async (req,res,next)=>{
        const {userId,isAuthenticated} = getAuth(req);

        if(!userId){
            return res.status(401).json({message:'Unauthorized token '})
        }

        if(!isAuthenticated){
            return res.status(401).json({message:'You are Unauthorized '})
        }

       next();

    }
]