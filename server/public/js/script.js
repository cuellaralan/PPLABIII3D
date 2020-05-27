//importo clase persona
import Persona from './entidades.js';
//obtengo referencias 
let btnTraer = document.getElementById('btnTraer'); 
let info = document.getElementById('info'); 
let form = document.getElementById('form1');
let main = document.querySelector('main');
let divTabla = document.getElementById('divTabla');


main.addEventListener('click', (e) =>{
    let btnB = document.querySelector('#btnBaja');
    let btnM = document.querySelector('#btnMod');
    console.log('se hizo click en el main');
    if (btnB != null && btnM !=null) {
        if (e.target == divTabla || e.target == main || e.target == form) {
            console.log('distinto de una fila');
            console.log(e.target);
            btnB.setAttribute('class', 'ocultar');  
            btnM.setAttribute('class', 'ocultar');  
            //crear en el css la clase con propiedades display y block y setearlas a los botones en esta condición
        }
        else {
            console.log('se presiono un elemento de tabla');
            console.log(e.target);
        }
        
    }
    else
    {
        console.log('botones nulos');
    }
    // console.log(e.target);
    // console.log(divTabla);
    // console.log(form);
});
//nodo que contendra la tabla


let formulario = document.forms[0];

formulario.onsubmit = (e) =>{
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado');
    //obtengo valores de formulario para dar de alta la persona
    let nombre = document.getElementsByName('nombre')[0].value;
    let apellido = document.getElementsByName('apellido')[0].value;
    let edad = parseInt(document.getElementsByName('edad')[0].value);
    let nuevaPersona = new  Persona(null, nombre, apellido, edad);
    
    altaPersona(nuevaPersona);
}

//agregos funcionalidad al EVENTO click del boton saludar
btnTraer.addEventListener('click', saludar);
btnTraer.addEventListener('click', despedir);
//evento agregado con arrow function
btnTraer.addEventListener('click', () =>
{
    console.log('hola soy un arrow function');
    console.log(event);

    btnTraer.removeEventListener('click', despedir);
});

function saludar (){
    console.log("hola mundo");
    
    console.log(event);
}
function despedir (){
    console.log("chau mundo");
    
    console.log(event);
}

//Traer personas
btnTraer.addEventListener('click' ,traerPersonas);
let img = document.createElement('img');
img.setAttribute('src', './images/spiner.gif');
img.setAttribute('alt', 'wait');

function traerPersonas()
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                while (divTabla.firstChild) {
                    divTabla.removeChild(divTabla.firstChild);
                }
                console.log(JSON.parse(xhr.responseText)); 
                let listaPersonas = JSON.parse(xhr.responseText);
                // console.log(listaPersonas.length);
                // console.log(Object.keys(listaPersonas[0]));
                // ALT 96 => ` `
                // info.innerHTML = `<p>id = ${listaPersonas[0].id} ${listaPersonas[0].nombre} ${listaPersonas[0].apellido}</p>`;
                generoTabla(listaPersonas);
                let tabla = document.querySelector('table');
                console.log(tabla);
                // tabla.addEventListener('click', funcionesTabla(tabla));
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }        
    };
    //si esta en la carpeta public no pongo http en la url
    xhr.open('GET','http://localhost:3000/traerPersonas');
    xhr.send();
}

function generoTabla(lista)
{
    
    //elementos table y tbody
    let tabla = document.createElement('table');
    let tbody = document.createElement('tbody');
    //tamaño de la lista
    let tamaño = lista.length;
    //se recibe una lista de objetos, en este caso personas
    //se debe recorrer la lista para obtener cada objeto y así
    //con el metodo Object.keys(listaPersonas[0])) obtendremos las claves
    //para crear los titulos de la tabla
    let arrayTitulos = Object.keys(lista[0]);
    let cantCampos = arrayTitulos.length;
    //creo titulos 
    let hileraT = document.createElement('tr');
    arrayTitulos.forEach(titulo => {
        let celdaT = document.createElement('td');
        let valorC = document.createTextNode(titulo);
        celdaT.appendChild(valorC);
        hileraT.appendChild(celdaT);
    });
    //agrego titulos a la tabla 
    tbody.appendChild(hileraT);
    // Crea las celdas 
    for (var i = 0; i < tamaño; i++) {
        // Crea las hileras de la tabla
        var hilera = document.createElement("tr");
        //obtenemos los valores del objeto i de la lista
        let persona = Object.values(lista[i]);
        for (var j = 0; j < cantCampos; j++) {
            // Crea un elemento <td> y un nodo de texto, haz que el nodo de
            // texto sea el contenido de <td>, ubica el elemento <td> al final
            // de la hilera de la tabla
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(persona[j]);
            celda.addEventListener('click', funcionesTabla);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        
        // agrega la hilera al final de la tabla (al final del elemento tblbody)
        tbody.appendChild(hilera);
    }
    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tbody);
    // appends <table> into <body>
    divTabla.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", "2");
}

function altaPersona(per)
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText).todoOk);
                traerPersonas();
                //con todoOk se puede tomar decisiones como enviar un ALERT o agregar el item a la lista
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }    
    }
    // por post se pasa cabecera
    xhr.open('POST', 'http://localhost:3000/altaPersona');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(per));
}

function funcionesTabla()//mandar por parametro tamaño de tabla para recorrer los nodos
{
    //obtengo referencia al nodo padre del elemento seleccionado
    let parent = this.parentNode;
    console.log(this.parentNode);
    //primer hijo
    let unHijo = parent.firstChild;
    console.log(unHijo);
    if (parent.hasChildNodes()) {
        // console.log(parent.childNodes);
        let childrens = parent.childNodes;
        console.log("nodos hijos = " + childrens.length);
        let cantChild = childrens.length;
        for (let i = 0; i < cantChild; i++) {
            //muestro todos los hijos del nodo padre de la tabla
            console.log(unHijo);
            unHijo = unHijo.nextSibling;
        }
    }
    //obtengo referencia a primer hijo y voy guardando las referencias a los hermanos siguientes
    //nextSibling me muestra el siguiente hermano, debo guardarlo en otra variable
    let btn1 = document.querySelector('#btnBaja');
    let btn2 = document.querySelector('#btnMod');
    console.log(btn1);
    if (btn1 == null) {
        let btnBaja = document.createElement('button');
        btnBaja.setAttribute('id', 'btnBaja');
        btnBaja.addEventListener('click', borra);
        let txtBaja = document.createTextNode('Baja')
        btnBaja.appendChild(txtBaja);
        let btnMod = document.createElement('button');
        btnMod.setAttribute('id', 'btnMod');
        btnMod.addEventListener('click', modifica);
        let txtMod = document.createTextNode('Modifica');
        btnMod.appendChild(txtMod);
        // console.log(tabla);
    
        form.appendChild(btnBaja);
        form.appendChild(btnMod);
    }
    else
    {
        btn1.setAttribute('class', 'mostrar');  
        btn2.setAttribute('class', 'mostrar');  
    }
}

function modifica(per)
{
    console.log('hola modifica');
}

function borra(per)
{
    console.log('hola borra');
}

