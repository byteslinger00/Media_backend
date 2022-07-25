import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


// get all users
export const getAllUsers = async(req, res) => {
    try {
        let users = await userModel.find();
        users = users.map((user) =>{
            const {password, ...otherDetails} = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// get a user
export const getUser = async(req, res) =>{
    const id = req.params.id;

    try {
        const user = await userModel.findById(id);

        if(user){
            const {password, ...otherDetails} = user._doc
            res.status(200).json(otherDetails)
        }
        else
        {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// update a user
export const updateUser = async(req, res) =>{
    const id = req.params.id;
    const {_id, currentUserAdminStatus, password} = req.body
    //if(id === currentUserId || currentUserAdminStatus)
    if(id === _id)
    {
        try {

            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt)
            }

            const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
            
            const token = jwt.sign({username: user, id: user._id},
                process.env.JWT_KEY, {expiresIn: "1h"})

            res.status(200).json({user, token})
        } catch (error) {
            res.status(500).json(error)
        }
    }else
    {
        res.status(403).json("Access Denied! You can only update your own profile.")
    }
}

// delete a user
export const deleteUser = async(req, res) =>{
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus} = req.body
    if(id === currentUserId || currentUserAdminStatus)
    {
        try {
            await userModel.findByIdAndDelete(id)
            res.status(200).json("User deleted Successfully")
        } catch (error) {
            res.status(500).json("Access Denied! You can only update your own account.")
        }
    }
}

// follow a user
export const followUser = async(req, res) =>{
    const id = req.params.id;

    const {_id} = req.body

    if(_id === id)
    {
        res.status(403).json("Action Forbidden")
    }
    else
    {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(_id)

            if(!followUser.followers.includes(_id))
            {
                await followUser.updateOne({$push : {followers: _id}})
                await followingUser.updateOne({$push: {following: id}})
                res.status(200).json("User Followed!")
            }
            else
            {
                res.status(403).json("Already followed.")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

// Unfollow a user
export const unfollowUser = async(req, res) =>{
    const id = req.params.id;

    const {_id} = req.body

    if(_id === id)
    {
        res.status(403).json("Action Forbidden")
    }
    else
    {
        try {
            const followUser = await userModel.findById(id)
            const followingUser = await userModel.findById(_id)

            if(followUser.followers.includes(_id))
            {
                await followUser.updateOne({$pull : {followers: _id}})
                await followingUser.updateOne({$pull: {following: id}})
                res.status(200).json("User Unfollowed!")
            }
            else
            {
                res.status(403).json("Not followed.")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}