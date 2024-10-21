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

    let immagine = document.createElement("img"); 
    immagine.setAttribute("src", "live.jpg");
    
    let titolo = document.createElement("h3");
    titolo.innerText = evento.nome;
    titolo.setAttribute("href", "card.html?=" + evento.id); 

    let descrizione = document.createElement("p");
    descrizione.innerText = evento.descrizione; 

    let spazioData = document.createElement("p"); 
    spazioData.innerText =  getItalianDate(evento.dataEvento); 

    carta.appendChild(immagine); 
    carta.appendChild(titolo); 
    carta.appendChild(spazioData); 
    carta.appendChild(descrizione); 
    
    return carta; 
}

function getEventCard2(evento){
    return `
            <div class="card">
                <img src="live.jpg">
                <div class="card-content">
                    <div class="card-title">${evento.nome}</div>
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
    }
}



async function getEventi(parametro){     //deve essere asincrona in quanto la fetch è asincrona di definizione, noi la aspettiamo con await 
    //TODO: far in modo che prenda il parametro della barra di ricerca 
    let eventi = new Array(); 
   // document.getElementById("ricerca").value;
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