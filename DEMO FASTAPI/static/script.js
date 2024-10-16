class Evento{
    constructor(id, nome, dataEvento, descrizione){
        this.id = id;
        this.nome = nome;
        this.dataEvento = dataEvento;
        this.descrizione = descrizione;
    }
}
async function getEventi() {
    let eventi = new Array();
    try{
        const response = await fetch('/get_eventi');
        console.log(response);
        const data = await response.json();
        console.log("dati dal server:", data);
        for(let a = 0; a < data.length; a++){
            const nome = data[a].nome;
            const id = data[a].id;
            const descrizione = data[a].descrizione;
            const dataEvento = data[a].data;
            let eventoSingolo = new Evento(id, nome, dataEvento, descrizione);
            eventi.push(eventoSingolo);
        }
        return eventi;
    }catch (error) {
        console.log("errore durante la richiesta", error);
        return null;
    }
}

function GetEventCard(evento){
    let carta = document.createElement("div");
    carta.setAttribute("class", "event-card");
    let immagine = document.createElement("img");
    let titolo = document.createElement("h3");
    titolo.innerText = evento.nome;
    let descrizione = document.createElement("p");
    descrizione.innerText = evento.descrizione;
    let spazioData = document.createElement("p");
    spazioData.innerText = italianDate(evento.dataEvento);

    carta.appendChild(immagine);
    carta.appendChild(titolo);
    carta.appendChild(spazioData);
    carta.appendChild(descrizione);

    return carta;
}



function italianDate(americanDate){
    dati = americanDate.split("-");
    return dati[2] + "/" + dati[1] + "/" + dati[0];
}


// Funzione per generare le card dinamicamente
function createCard(data) {
    return `
        <div class="card">
            <img src="${data.imageUrl}" alt="${data.title}">
            <div class="card-content">
                <div class="card-title">${data.title}</div>
                <div class="card-description">${data.description}</div>
            </div>
        </div>
    `;
}

function getEventCard2(evento) {
    return `
        <div class="card">
            <img src="${evento.imageUrl}" alt="${evento.title}">
            <div class="card-content">
                <div class="card-title">${evento.nome}</div>
                <div class="card-description">${italianDate(evento.dataEvento)}</div>
                <div calss="card-description">${evento.descrizione}</div>
            </div>
        </div>
    `;
}



async function updateEventi() {
    let eventi = await getEventi();
    if(eventi == null){
        console.log("nessun evento caricato");
        return;
    }
    let divGenitore = document.getElementById("card-container");
    divGenitore.innerHTML = '';
    for(let a = 0; a <eventi.length; a++){
        divGenitore.innerHTML += (getEventCard2(eventi[a]));
    }
}

async function updateTopEventi() {
    let eventi = await getEventi();
    if(eventi == null){
        console.log("nessun evento caricato");
        return;
    }
    let divGenitore = document.getElementById("EventiDisponibili");
    divGenitore.innerHTML = '';
    for(let a = 0; a <eventi.length; a++){
        divGenitore.innerHTML += getEventCard2(eventi[a]);
    }
}

