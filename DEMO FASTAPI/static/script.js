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


function createPrenotaButton(eventoId) {
    let container = document.createElement("div");

    // Input per il numero di ospiti
    let inputNumeroOspiti = document.createElement("input");
    inputNumeroOspiti.type = "number";
    inputNumeroOspiti.min = "1";
    inputNumeroOspiti.value = "1";
    inputNumeroOspiti.placeholder = "Numero ospiti";

    // Bottone "PRENOTA"
    let prenota = document.createElement("button");
    prenota.innerText = "PRENOTA";

    // Aggiungi evento al click
    prenota.addEventListener("click", async () => {
        const numeroOspiti = parseInt(inputNumeroOspiti.value);
        if (isNaN(numeroOspiti) || numeroOspiti <= 0) {
            alert("Inserisci un numero valido di ospiti");
            return;
        }

        try {
            const response = await fetch("/prenota_evento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // Importante per inviare i cookie di sessione
                body: JSON.stringify({ evento_id: eventoId, numero_ospiti: numeroOspiti })
            });

            console.log(eventoId, numeroOspiti);

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Notifica di successo
                location.href = `singoloevento.html?id=${eventoId}`; // Reindirizza alla pagina dell'evento
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "Errore durante la prenotazione");
            }
        } catch (error) {
            console.error("Errore durante la prenotazione:", error);
            alert("Errore imprevisto. Riprova più tardi.");
        }
    });

    // Aggiungi input e bottone al container
    container.appendChild(inputNumeroOspiti);
    container.appendChild(prenota);

    return container;
}




async function checkLoginAndRedirect(link) {
    try {
        const response = await fetch("/utente_me", { 
            method: "GET", 
            credentials: "include" // Importante per inviare i cookie di sessione
        });

        if (response.ok) {
            // L'utente è loggato
            const data = await response.json();
            console.log(data.message); // Opzionale: mostra un messaggio di conferma
            location.href = link; // Reindirizza alla pagina specifica
        } else {
            // L'utente non è loggato
            throw new Error("Non sei loggato");
        }
    } catch (error) {
        alert("Devi essere loggato per accedere a questa funzione!"); // Mostra un avviso
        location.href = "login.html"; // Reindirizza alla pagina di login
    }
}




//funzione grafica che mi crea le parti HTML sulla base degli eventi 
function getEventCard(evento) {
    let carta = document.createElement("div");
    carta.setAttribute("class", "event-card");

    console.log("Oggetto evento:", evento);

    const link = 'singoloevento.html?id=' + (evento?.id || "");

    let immagine = document.createElement("img");
    immagine.setAttribute("src", "live.jpg");
    immagine.setAttribute("alt", "Immagine evento");

    let titolo = document.createElement("h3");
    titolo.innerText = evento?.nome || "Nome evento non disponibile";

    let descrizione = document.createElement("p");
    descrizione.innerText = evento?.descrizione || "Descrizione non disponibile";

    let spazioData = document.createElement("p");
    console.log("evento.dataEvento:", evento?.dataEvento); // Verifica la data

    const eventoData = evento?.dataEvento || null;
    if (eventoData) {
        try {
            spazioData.innerText = getItalianDate(eventoData);
        } catch (error) {
            console.error("Errore nella conversione della data:", error);
            spazioData.innerText = "Data non disponibile";
        }
    } else {
        spazioData.innerText = "Data non disponibile";
    }

    let prenotaContainer = createPrenotaButton(evento?.id || "");

    carta.appendChild(immagine);
    carta.appendChild(titolo);
    carta.appendChild(spazioData);
    carta.appendChild(descrizione);
    carta.appendChild(prenotaContainer);

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

async function prenotaEvento(eventoId) {
    const inputOspiti = document.getElementById(`numero-ospiti-${eventoId}`);
    const numeroOspiti = parseInt(inputOspiti.value);

    if (isNaN(numeroOspiti) || numeroOspiti <= 0) {
        alert("Inserisci un numero valido di ospiti");
        return;
    }

    try {
        const response = await fetch("/prenota_evento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ evento_id: eventoId, numero_ospiti: numeroOspiti })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            location.href = `singoloEvento.html?id=${eventoId}`; // Reindirizza alla pagina dell'evento
        } else {
            const errorData = await response.json();
            alert(errorData.detail || "Errore durante la prenotazione");
        }
    } catch (error) {
        console.error("Errore durante la prenotazione:", error);
        alert("Errore imprevisto. Riprova più tardi.");
    }
}


function getEventCard2(evento) {
    const prenotaButtonHtml = `
        <div class="prenota-container">
            <input type="number" min="1" value="1" placeholder="Numero ospiti" id="numero-ospiti-${evento.id}">
            <button onclick="prenotaEvento(${evento.id})">PRENOTA</button>
        </div>
    `;

    return `
        <div class="card">
            <img src="live.jpg">
            <div class="card-content">
                <div class="card-title">${evento.nome}</div>
                <a href="singoloEvento.html?id=${evento.id}">Scopri di più</a>
                <div class="card-description">${getItalianDate(evento.dataEvento)}</div>
                <div class="card-description">${evento.descrizione}</div>
                ${prenotaButtonHtml}
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
        const data = await response.json();  // la risposta da parte del db sottoforma di JSON
        console.log('Risposta dal server:', data);  // Aggiungi questo log per verificare cosa ricevi

        // Verifica la presenza del campo message (che contiene l'email dell'utente)
        if (data && data.message) {
            document.getElementById("username").innerText = `Ciao, ${data.message.split(' ')[3]}`;  // Estrae l'email dall'output
            document.getElementById("login-logout").innerText = "Logout"; // Modifica il testo per logout
            document.getElementById("login-logout").setAttribute("onclick", "LogOut()"); // Imposta l'evento di logout
            document.getElementById("signup-login").style.display = "none"; // Nascondi il link di login/signup
        } else {
            console.log('Errore, nessun messaggio trovato:', data);  // Mostra un messaggio di errore se la risposta non è quella aspettata
        }
    } catch (error) {
        console.error('Errore durante la richiesta:', error);  // Aggiungi log di errore in caso di problemi
    }
}


async function LogOut() {
    try {
        // Invia la richiesta di logout al server
        const response = await fetch('/logout', {
            method: 'GET',
        });

        // Se la richiesta è andata a buon fine, aggiorna la UI
        const data = await response.json();
        console.log(data);  // Aggiungi questo log per verificare la risposta

        // Cambia il testo del bottone per "Login" e nascondi il pulsante di Logout
        document.getElementById("login-logout").setAttribute("onclick", "location.href='/login'");  // Reindirizza alla pagina di login
        document.getElementById("signup-login").style.display = "block";  // Rendi visibile il link di registrazione/login
        document.getElementById("username").innerText = "";  // Rimuovi il nome utente dalla UI
    } catch (error) {
        console.error('Errore durante il logout:', error);  // Aggiungi log di errore in caso di problemi
    }
}

