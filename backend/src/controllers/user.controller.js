import { clerkClient, getAuth } from '@clerk/express';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { GenerateUniqueUsername } from '../config/generateUsername.js';
import Follow from '../models/follow.model.js'
import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';

export const getUserProfile = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req);

    const user = await User.find({clerkId:userId});

    if(!user){
        return res.status(404).json({message:'User not found'})
    }

    return res.status(200).json({message:'Profile get successfully',user});
})

export const updateprofile = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req);

    const user = await User.findOne({clerkId:userId});

    if(!user){
        return res.status(404).json({message:'User not found'})
    }

    const updatedUser = await User.findOneAndUpdate({clerkId:userId},req.body,{new:true,runValidators:true});

    return res.status(200).json({message:'profile updated successfully',user:updatedUser});
})

export const syncUserToDb = asyncHandler(async(req,res)=>{
    
})


export const adddUserToDb  = asyncHandler(async(req,res)=>{

     const {userId} = getAuth(req);

     //check if user is alreday exist or not 

     const existingUser = await User.find({clerkId:userId});

     if(existingUser){
        return res.status(400).json({message:'User already exists'})
     }

     //get clerkUser

     const clerkUser = await clerkClient.users.getUser(userId);



     //now craeate user 

     const username = await GenerateUniqueUsername(clerkUser.firstName,clerkUser.lastName || '')

     const newUser = await User.create({
        firstname:clerkUser.firstName || '',
        lastname:clerkUser.lastName || '',
        email:clerkUser.primaryEmailAddress.emailAddress ,
        clerkId:userId,
        imageUrl:clerkUser.imageUrl || '',
        postCount:0,
        username,
        followers:0,
        following:0,
     })

     return res.status(201).json({message:'User created successfully',user:newUser});
})


export const getCurrentUser = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req);

    const user = await User.find({clerkId:userId});

    if(!user){
        return res.status(404).json({message:'User not found'})
    }

    return res.status(200).json({message:'Current user got successfully',user})
})


export const followUser = asyncHandler(async(req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();

    const {userId}  =  req.params;

    const {userId:currentUserId} = getAuth(req);

    if(!userId || !currentUserId){
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({message:'Invalid request.'})
    }

    const followingUser = await User.findById(userId);

    if(!followingUser || followingUser.accountStatus==='deleted'){
          await session.abortTransaction();
          session.endSession();
        return res.status(404).json({message:'User you want to follow does not exists.'});
    }

    const currentUser = await User.findById(currentUserId);

    if(currentUser && currentUser.accountStatus==='active'){
        //then i will allow user to follow one another

        //first check if both user do not have same id 

        if(currentUser._id.equals(followingUser._id)){

              await session.abortTransaction();
              session.endSession();

            return res.status(400).json({message:"same user can't follow himself"})
        }

        //check if current user already following the targated user 

        const alreadyFollowing = await Follow.exists({
            followerId:currentUser._id,
            followingId:followingUser._id
        },{session})

        if(alreadyFollowing){
              await session.abortTransaction();
              session.endSession();
            return res.status(409).json({message:'You already follow this user'});
        }
        
        //increase user following because he is following someone
        currentUser.following+=1;

        //increase than peron followers count who is following by current user
        followingUser.followers+=1;

        await currentUser.save();

        //now update follow document;

        await Follow.create({
           followerId:currentUser._id,
           followingId:followingUser._id 
        },{session}) 

        //send notifcation to user ;

        await Notification.create({
            from:currentUser._id,
            to:followingUser._id,
            type:'follow',
        },{session})


        await session.commitTransaction();

        res.status(200).json({message:'Followed successfully',follower:currentUser,following:followingUser});
    }

    return res.status(400).json({message:"You can't follow anyone"});

   

})

export const unfollowUser = asyncHandler(async(req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();

    const {userId} = req.params;

    const {userId:currentUserId} = getAuth(req);

    if(!userId|| !currentUserId){
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({message:'Invalid request'});
    }

    const unFollowingUser = await User.findById(userId);

    if(!unFollowingUser || unFollowingUser.accountStatus==='deleted'){
         await session.abortTransaction();
        session.endSession();
        return res.status(404).json({message:'The user you want to unfollow do not exists'});
    }

    const currentUser = await User.findById(currentUserId);

    if(!currentUser || currentUser.accountStatus!=='active' ){
         await session.abortTransaction();
        session.endSession();
        return res.status(400).json({message:'You account do not exists.'})
    }

    if(currentUser._id.equals(unFollowingUser._id)){
         await session.abortTransaction();
        session.endSession();
        return res.status(400).json({message:"You can't unfollow yourself"})
    }

    //check if curent user is already follwong the targated user then olny he can unfollow

    const alreadyFollow = await Follow.exists({
        followerId:currentUser._id,
        followingId:unFollowingUser._id
    },{session})

    if(!alreadyFollow){
         await session.abortTransaction();
        session.endSession();
        return res.status(400).json({message:"You are not following this user"})
    }

    currentUser.following-=1;

    unFollowingUser.followers-=1;

    await currentUser.save();
    await unFollowingUser.save();

    //now update follow document 

    await Follow.findByIdAndDelete(alreadyFollow._id,{session});

    return res.status(200).json({message:'Unfollowed successfully'})
})