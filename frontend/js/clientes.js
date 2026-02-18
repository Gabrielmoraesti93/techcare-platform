const API="https://moraes-tech.onrender.com";


async function salvarCliente(){

const nome=document.getElementById("nome").value;

const telefone=document.getElementById("telefone").value;


await fetch(API+"/clientes",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

nome,

telefone

})

});


listar();


}



async function listar(){


const res=await fetch(API+"/clientes");

const clientes=await res.json();


const lista=document.getElementById("lista-clientes");

lista.innerHTML="";


clientes.forEach(c=>{


const li=document.createElement("li");

li.innerText=c.nome+" - "+c.telefone;


lista.appendChild(li);


});


}


listar();
