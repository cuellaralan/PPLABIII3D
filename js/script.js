//importo clase persona
import Anuncio_Auto from './entidades.js';
//obtengo referencias 
let info = document.getElementById('info'); //donde se muestra el spiner
let form = document.getElementById('form1');
let main = document.querySelector('main');
let divTabla = document.getElementById('divTabla');
let art3 = document.querySelector('#art3');
let art2 = document.querySelector('#art2');
let artf = document.querySelector('#artf');
let contTabla = document.querySelector('#contTabla'); 
//referencias formulario elementos
let id = document.querySelector('#txtId');
let titulo = document.querySelector('#txtTitulo');
let radioV = document.querySelector('#rdoVenta');
let radioA = document.querySelector('#rdoAlquiler');
let trans = document.querySelector('#selTrans')
let descrip = document.querySelector('#txtDescrip');
let precio = document.querySelector('#txtPrecio');
let baños = document.querySelector('#txtBaño');
let autos = document.querySelector('#txtautos');
let piezas = document.querySelector('#txtDormi');

window.addEventListener('load', traerPersonas);

main.addEventListener('click', (e) =>{
    let btnB = document.querySelector('#btnBaja');
    let btnG = document.querySelector('#btnGuarda');
    let btnC = document.querySelector('#btnCancela');

        if (e.target == divTabla || e.target == main || e.target == form || e.target == art2 || e.target == artf || e.target == art3 || e.target == contTabla) {
            // console.log('distinto de una fila' + e.target);
            // console.log(e.target);
            btnB.setAttribute('class', 'ocultar');  
            btnG.setAttribute('class', 'ocultar');  
            btnC.setAttribute('class', 'ocultar');  
            cancela();
            //crear en el css la clase con propiedades display y block y setearlas a los botones en esta condición
        }
});

let formulario = document.forms[0];
let btnAlta = document.getElementById('btnAlta');
btnAlta.addEventListener('click', (e) =>{
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado');    
    //obtengo valores de formulario para dar de alta al anuncio
    let tittle = titulo.value;
    let transaction = trans.value; 
    let description = descrip.value;
    let price = precio.value;
    let bath = baños.value;
    let car = autos.value;
    let room = piezas.value;
    if (tittle != '' && transaction != '' && description != '' && price != 0 && bath != 0 && car != 0 && room != 0) {
        let nuevoAnuncio = new Anuncio_Auto(null, tittle, transaction, description, price, bath, car, room);
        console.log(nuevoAnuncio);
        altaPersona(nuevoAnuncio);
    } else {
        alert('existen datos vacíos');
    }
});
let btnBaja = document.querySelector('#btnBaja');
btnBaja.addEventListener('click', (e) => {
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado - Baja');   
    let valId = id.value;
    bajaPersona(valId); 
});

let btnGuarda = document.querySelector('#btnGuarda');
btnGuarda.addEventListener('click', async (e) =>{
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado - Modifica');   
    let idV = id.value;
    let tittle = titulo.value;
    let transaction = trans.value; 
    let description = descrip.value;
    let price = precio.value;
    let bath = baños.value;
    let car = autos.value;
    let room = piezas.value;
    let nuevoAnuncio = new Anuncio_Auto(idV, tittle, transaction, description, price, bath, car, room);
    console.log(nuevoAnuncio);
    modificaAnuncio(nuevoAnuncio);

});
//Traer personas
let img = document.createElement('img');
img.setAttribute('src', './img/spiner.gif');
img.setAttribute('alt', 'wait');

function traerPersonas()
{
    console.log('cargando');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                while (divTabla.firstChild) {
                    divTabla.removeChild(divTabla.firstChild);
                }
                let respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message == 'Carga Exitosa') {
                    let listaPersonas = respuesta.data;
                    generoTabla(listaPersonas);
                    let tabla = document.querySelector('table');
                    console.log(tabla);
                }
                else{
                    alert('no se pudo obtener los datos del servidor');
                } 
                console.log(respuesta.message);
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }        
    };
    //si esta en la carpeta public no pongo http en la url
    xhr.open('GET','http://localhost:3000/traer');
    xhr.send();
}

function generoTabla(lista)
{
    //elementos table y tbody
    let tabla = document.createElement('table');
    tabla.setAttribute('class', 'tabla');
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
    hileraT.setAttribute('class', 'tituloT');
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

function altaPersona(anu)
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText).message);
                traerPersonas();
                cancela();
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }    
    }
    // por post se pasa cabecera
    xhr.open('POST', 'http://localhost:3000/alta');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(anu));
}

function bajaPersona(parm)
{
    console.log('ide es :' + parm);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                traerPersonas();
                cancela();
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
    xhr.open('POST', 'http://localhost:3000/baja');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(`id=${parm}`);
    // xhr.setRequestHeader('content-type', 'application/json');
    // xhr.send(JSON.stringify(`id=${parm}`));
}

function modificaAnuncio(anu)
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText).todoOk);
                traerPersonas();
                cancela();
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
    xhr.open('POST', 'http://localhost:3000/modificar');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(anu));
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
            let valor = unHijo.innerHTML;
            console.log(valor);
            unHijo = unHijo.nextSibling;
            switch (i) {
                case 0:
                    id.value = valor;
                    break;
                case 1:
                    titulo.value = valor;
                    break;
                case 2:
                    trans.value = valor;
                    break;
                case 3:
                    descrip.value = valor;
                    break;
                case 4:
                    precio.value = valor;

                    break;
                case 5:
                    baños.value = valor;

                    break;
                case 6:
                    autos.value = valor;
                    break;
                case 7:
                    piezas.value = valor;
                    break;
                default:
                    break;
            }
        }
    }
    //obtengo referencia a primer hijo y voy guardando las referencias a los hermanos siguientes
    //nextSibling me muestra el siguiente hermano, debo guardarlo en otra variable
    let btn1 = document.querySelector('#btnBaja');
    let btn2 = document.querySelector('#btnGuarda');
    let btn3 = document.querySelector('#btnCancela');
    // console.log(btn1);
    // if (btn1 == null) {
    //     console.log('creando elemento de tabla');
    //     let btnBaja = document.createElement('button');
    //     btnBaja.setAttribute('id', 'btnBaja');
    //     btnBaja.setAttribute('class', 'btn btn-primary');
    //     btnBaja.addEventListener('click', borra);
    //     let txtBaja = document.createTextNode('Baja')
    //     btnBaja.appendChild(txtBaja);
    //     let btnMod = document.createElement('button');
    //     btnMod.setAttribute('id', 'btnMod');
    //     btnMod.setAttribute('class', 'btn btn-primary');
    //     btnMod.addEventListener('click', modifica);
    //     let txtMod = document.createTextNode('Modifica');
    //     btnMod.appendChild(txtMod);
    //     // console.log(tabla);

    //     art3.appendChild(btnBaja);
    //     art3.appendChild(btnMod);
    // }
    // else {
        console.log('creando botones ocultos');
        btn1.setAttribute('class', 'btn btn-primary mostrar');
        btn2.setAttribute('class', 'btn btn-primary mostrar');
        btn3.setAttribute('class', 'btn btn-primary mostrar');
    // }
}

function modifica(per)
{
    console.log('hola modifica');
}

function borra(per)
{
    console.log('hola borra');
}

function cancela() {
    titulo.value = ' ';
    trans.value = ' ';
    descrip.value = ' ';
    precio.value = ' ';
    baños.value = ' ';
    autos.value = ' ';
    piezas.value = ' ';
}

