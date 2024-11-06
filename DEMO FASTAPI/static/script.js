class Evento{
    constructor(id, nome, descrizione, dataEvento){
        this.id = id; 
        this.nome = nome; 
        this.descrizione = descrizione; 
        this.dataEvento = dataEvento; 
    }
}


//prende una data americana e la trasforma in europa
//2024-10-30 --> split("-") --> [2024, 10, 30]
//30/10/2024
function getItalianDate(americanDate){
    dati = americanDate.split("-");  
    return dati[2] + "/" + dati[1] + "/" + dati[0]; 
}



//funzione grafica che mi crea le parti HTML sulla base degli eventi 
function getEventCard(evento){
    let carta = document.createElement("div"); 
    carta.setAttribute("class", "event-card"); 


    //creazione del componente di LINK
    let collegamento = document.createElement("a");
    collegamento.innerText = "Scopri di piu";

    const link = 'singoloevento.html?id=' + evento.id; 
    collegamento.setAttribute("href", link);

    let immagine = document.createElement("img"); 
    immagine.setAttribute("src", "live.jpg");
     
    let titolo = document.createElement("h3"); 
    titolo.innerText = evento.nome; 

    let descrizione = document.createElement("p"); 
    descrizione.innerText = evento.descrizione;

    let prenota = document.createElement("button");
    prenota.innerText = "PRENOTA";
    //prenota.setAttribute("onclick", "location.href =" + `"${link}"`);
    prenota.setAttribute("onclick", "Cheklogin()");
    let spazioData = document.createElement("p"); 
    spazioData.innerText =  getItalianDate(evento.dataEvento); 

    carta.appendChild(immagine); 
    carta.appendChild(titolo); 
    carta.appendChild(collegamento); 
    carta.appendChild(spazioData); 
    carta.appendChild(descrizione);
    carta.appendChild(prenota);
    
    return carta; 
}

function updatePage(){
    console.log("UPDATE PAGE"); 
    console.log(eventoLetto); 
    //TODO: prende l'evento che è stato letto e aggiorna le componenti della pagina con quei dati 
    document.getElementById("event-id").innerText = eventoLetto.nome; 
}



function updatePage(){
    console.log("UPDATE PAGE"); 
    console.log(eventoLetto); 
    //TODO: prende l'evento che è stato letto e aggiorna le componenti della pagina con quei dati 
    document.getElementById("event-id").innerText = eventoLetto.nome; 
}


async function getEvento(id){     //deve essere asincrona in quanto la fetch è asincrona di definizione, noi la aspettiamo con await 
    console.log("CHIAMATO IL GET EVENTO"); 
    try {
        const response = await fetch('/get_evento?id='  + id);
        const data = await response.json();     //la risposta da parte del db sottoforma di JSON 
        console.log('Dati dal server:', data);
    
        for(let a = 0; a < data.length; a++){       //for o foreach  (CICLA 1 VOLTA)
            const nome = data[a].nome; 
            const id = data[a].id; 
            const descrizione = data[a].descrizione;  
            const dataEvento = '2024-10-23' //data[a].data; 
            console.log(nome); 
            console.log(id); 
            console.log(descrizione); 
            console.log(dataEvento); 
        

            let eventoSingolo = new Evento(id, nome, descrizione, dataEvento); 
            console.log(eventoSingolo); 
            return eventoSingolo; 
        }
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        return null; 
}
}

function getEventCard2(evento){
    return `
            <div class="card">
                <img src="live.jpg">
                <div class="card-content">
                    <div class="card-title">${evento.nome}</div>
                    <a href="singoloEvento.html?id=${evento.id}">Scopri di piu'</a>
                    <div class="card-description">${getItalianDate(evento.dataEvento)}</div>
                    <div class="card-description">${evento.descrizione}</div>
                
                </div>
            </div>
        `;
}


async function updateTopEventi(){
    eventi = await getTopEventi(); 
    console.log(eventi); 
    if(eventi == null){
        console.log("PROBLEMI DI CONNESSIONE")
        return; 
    }
    let divGenitore = document.getElementById("eventiDisponibili"); 
    divGenitore.innerHTML = ""; 

    for(let a = 0; a < eventi.length; a++){
        divGenitore.appendChild(getEventCard(eventi[a])); 
    }

}

async function updateEventi(parametro) {
    
    let eventi = await getEventi(parametro); 
    if(eventi == null){
        console.log("Nessun evento caricato"); 
        return; 
    }
    let divGenitore = document.getElementById("card-container");
    divGenitore.innerHTML = ''; 
    for(let a = 0; a < eventi.length; a++ ){
        divGenitore.innerHTML += getEventCard2(eventi[a]); 

        //divGenitore.appendChild(getEventCard2(eventi[a])); 
    }
}



async function getEventi(parametro){     //deve essere asincrona in quanto la fetch è asincrona di definizione, noi la aspettiamo con await 
    //TODO: far in modo che prenda il parametro della barra di ricerca 

    console.log("GET EVENTI IN EXEC"); 
    let eventi = new Array(); 
    
    //const parametro = "live"; 

    try {
        const response = await fetch(`/get_eventi?ricerca=${parametro}`);
        const data = await response.json();     //la risposta da parte del db sottoforma di JSON 
        console.log('Dati dal server:', data);
    
        for(let a = 0; a < data.length; a++){       //for o foreach 
            const nome = data[a].nome; 
            const id = data[a].id; 
            const descrizione = data[a].descrizione;  
            const dataEvento = data[a].data; 

            let eventoSingolo = new Evento(id, nome, descrizione, dataEvento); 
            eventi.push(eventoSingolo); 
        }
        console.log("eventi catturati tutti. "); 
        console.log(eventi); 
        return eventi; 
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        return null; 
    }
}



 async function getTopEventi(){     //deve essere asincrona in quanto la fetch è asincrona di definizione, noi la aspettiamo con await 
    let eventi = new Array(); 
    try {
        const response = await fetch('/get_top_eventi');
        const data = await response.json();     //la risposta da parte del db sottoforma di JSON 
        console.log('Dati dal server:', data);
    
        for(let a = 0; a < data.length; a++){       //for o foreach 
            const nome = data[a].nome; 
            const id = data[a].id; 
            const descrizione = data[a].descrizione;  
            const dataEvento = data[a].data; 

            let eventoSingolo = new Evento(id, nome, descrizione, dataEvento); 
            eventi.push(eventoSingolo); 
        }
        return eventi; 
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        return null; 
    }
}

async function Cheklogin() {
    try {
        const response = await fetch('/utente_me');
        const data = await response.json();     //la risposta da parte del db sottoforma di JSON 
        if(data){
            alert(JSON.stringify(data));
            document.getElementById("username").innerText = JSON.stringify(data);
        }
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        return null; 
    }
}

async function LogOut() {
    try {
        const response = await fetch('/logout');
        const data = await response.json();     //la risposta da parte del db sottoforma di JSON 
        alert(JSON.stringify(data));
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        return null; 
    }
}
