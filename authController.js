const db=require("../database");

const bcrypt=require("bcryptjs");

const jwt=require("jsonwebtoken");


exports.login=(req,res)=>{


const {email,password}=req.body;


db.get(

"SELECT * FROM users WHERE email=?",

[email],

async(err,user)=>{


if(!user)

return res.status(404).json({});


const ok=await bcrypt.compare(

password,

user.password

);


if(!ok)

return res.status(401).json({});


const token=jwt.sign(

{id:user.id},

"moraestech"

);


res.json({token});


});


};
