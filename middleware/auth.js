import express from 'express';
import userModel from "../model/userModel.js";
import  Jwt  from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
     
        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        const {id} = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!id) return res.status(400).json({msg: "Invalid Authentication."})

        const user = await userModel.findById(id)
        
        req.user = user
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export default auth