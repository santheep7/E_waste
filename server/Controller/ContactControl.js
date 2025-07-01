const ContactModel = require('../model/contactmodel')


const createmessage = async(req,res)=>{
    try{
        const {name,email,message} = req.body;
        const newcontact = new ContactModel({name,email,message});
        await newcontact.save();
        res.status(201).json({success:true,message:'message sent suucessfully!'})

    }catch(error){
        res.status(500).json({success:false,message:'something went wrong',error})
    }
};


module.exports = {createmessage}