import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const requireActiveUser = async(req,res,next)=>{
     const {userId} = getAuth(req);

     
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId: userId });

        if (!user || user.accountStatus === "deleted") {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // 🔥 attach to req
        next();
}