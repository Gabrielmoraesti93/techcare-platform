const db=require("../database");


exports.dashboard=(req,res)=>{


db.get(

"SELECT COUNT(*) as total FROM clientes",

[],

(err,clientes)=>{


db.get(

"SELECT COUNT(*) as total FROM chamados",

[],

(err, chamados)=>{


res.json({

clientes:clientes.total,

chamados:chamados.total

});


});


});


};
