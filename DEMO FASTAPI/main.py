from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import mysql.connector



from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.sessions import SessionMiddleware  

SECRET_KEY = "YIO2Y3R459234"  
app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")



# Connessione al database MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",  # Inserisci il tuo nome utente del database
    password="",  # Inserisci la password del database
    database="ticket_one",  # Inserisci il nome del tuo database
    port=3306
)


#default relocation in sratic main_page 
@app.get("/")
async def root():
    return RedirectResponse("static/main_page.html")


@app.get("/get_comuni")
async def get_comuni():
    try:
        cursor = conn.cursor()
        query = "SELECT nome, ID_comune FROM comune"
        print("sto eseguendo la query del comune"); 
        cursor.execute(query)
        result = cursor.fetchall()
        # Converte il risultato in un formato utilizzabile per il front-end (es. lista di dizionari)
        data = [{"nome": row[0], "id":row[1]} for row in result]
        return JSONResponse(content=data)
    except mysql.connector.Error as err:
        return JSONResponse(content={"error": f"Errore nel recupero dei dati: {err}"})
    finally:
        if 'cursor' in locals():
            cursor.close()




@app.get("/get_top_eventi")
async def get_eventi():
    try:
        cursor = conn.cursor()
        interrogazione = 'SELECT ID_Evento, nome, data, descrizione FROM evento ORDER BY capienza_max DESC LIMIT 5 ;'
        cursor.execute(interrogazione)
        result = cursor.fetchall() 
        datiCatturati = [{"id": row[0], "nome":row[1], "data": row[2].isoformat(), "descrizione":row[3]} for row in result]
        print(datiCatturati)
        return  JSONResponse(content=datiCatturati) 
    except mysql.connector.Error as err: 
        return JSONResponse(content={"error": f"Errore nel recupero dei dati: {err}"})
    finally: 
        if 'cursor' in locals(): 
            cursor.close()


#(int numero)
#(nomeVariabile: type)


@app.get("/get_eventi")
async def get_eventi(ricerca: str = ''):
    print("STRINGA RICERCA: ")
    print(ricerca)
    try:
        cursor = conn.cursor()
        interrogazione = 'SELECT ID_Evento, nome, data, descrizione FROM evento'
        if len(ricerca) > 0:
            interrogazione += ' WHERE nome LIKE "%' + ricerca  + '%"'
        print(interrogazione)
        cursor.execute(interrogazione)
        result = cursor.fetchall() 
        datiCatturati = [{"id": row[0], "nome":row[1], "data": row[2].isoformat(), "descrizione":row[3]} for row in result]
        print(datiCatturati)
        return  JSONResponse(content=datiCatturati) 
    except mysql.connector.Error as err: 
        return JSONResponse(content={"error": f"Errore nel recupero dei dati: {err}"})
    finally: 
        if 'cursor' in locals(): 
            cursor.close()

@app.get("/get_evento")
async def get_evento(id : str): 
    print("ID DA CERCARE: ")
    print(id) 
    try:
        cursor = conn.cursor()
        #TODO: Aggiungere la JOIN che legga il luogo dell'evento, il comune e la provincia (opzionale: gli iscritti attuali all'evento ad oggi)
        interrogazione = 'SELECT ID_Evento, nome, data, descrizione FROM evento WHERE ID_Evento = %s'
     
        print(interrogazione)
        cursor.execute(interrogazione, (id,))
        result = cursor.fetchall() 
        datiCatturati = [{"id": row[0], "nome":row[1], "data": row[2].isoformat(), "descrizione":row[3]} for row in result]
        print(datiCatturati)
        return  JSONResponse(content=datiCatturati) 
    except mysql.connector.Error as err: 
        return JSONResponse(content={"error": f"Errore nel recupero dei dati: {err}"})
    finally: 
        if 'cursor' in locals(): 
            cursor.close()






@app.post("/reg_comune")
async def reg_comune(request: Request):
    data = await request.json()
    nome = data.get("nome")
    provincia = data.get("provincia")
    #sconto_marca = float(sconto_marca)
    print("HO RICEVUTO QUESTI DATI")
    print(nome)
    print(provincia)

    try:
        cursor = conn.cursor()
        # Query di inserimento
        query = "INSERT INTO comune (nome, provincia) VALUES (%s, %s)"
        # Dati da inserire
        dati = (nome, provincia)
        # Esecuzione della query
        cursor.execute(query, dati)
        # Commit delle modifiche
        conn.commit()
        print("dati inseriti")
        return {"Status": "comune inserito"}
    except mysql.connector.Error as err:
        print("ci sono stati problemi in inserimento")
        return {"Errore": f"Errore durante l'inserimento: {err}"}
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

  
@app.post("/login")
async def login(request: Request):
    print("Sto eseguendo il login")
    data = await request.json()
    username_inserito = data.get("username")
    psw_inserita = data.get("psw")
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM utente WHERE email = %s AND psw = %s"
        dati = (username_inserito, psw_inserita)
        cursor.execute(query, dati)
        result = cursor.fetchone()
        
        if result:
            request.session["user"] = result["email"] 
            print("Accesso consentito, sessione impostata:", request.session["user"])
            return JSONResponse({"message": "Login effettuato con successo"})
        else:
            print("Accesso negato")
            return JSONResponse({"message": "Password o nome utente errati"}, status_code=401)

    except mysql.connector.Error as err:
        print("Errore durante l'inserimento")
        return JSONResponse({"Errore": f"Errore durante l'inserimento: {err}"}, status_code=500)
    finally:
        cursor.close()

@app.post("/signup")
async def signup(request: Request):
    data = await request.json()
    email = data.get("email")
    psw = data.get("psw")
    id_comune = data.get("id_comune")

    print("HO RICEVUTO QUESTI DATI")
    print(email)
    print(psw)
    print(id_comune)

    try:
        cursor = conn.cursor()
        # Query di inserimento
        query = "INSERT INTO utente (email, psw, id_comune) VALUES (%s, %s, %s)"
        dati = (email, psw, id_comune)
        cursor.execute(query, dati)
        conn.commit()

        # Imposta la sessione per l'utente appena registrato
        request.session["user"] = email
        print(f"Sessione impostata per l'utente: {email}")
        return {"message": "Registrazione completata e sessione impostata"}
    except mysql.connector.Error as err:
        print("ci sono stati problemi in inserimento")
        return {"Errore": f"Errore durante l'inserimento: {err}"}
    finally:
        if 'cursor' in locals():
            cursor.close()


@app.post("/prenota_evento")
async def prenota_evento(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Devi essere loggato per prenotare un evento")
    
    data = await request.json()
    evento_id = data.get("evento_id")
    numero_ospiti = data.get("numero_ospiti")
    
    if not evento_id or not numero_ospiti:
        raise HTTPException(status_code=400, detail="ID evento e numero ospiti sono richiesti")
    
    try:
        cursor = conn.cursor()
        
        # Verifica se l'evento esiste
        verifica_evento_query = "SELECT ID_Evento FROM evento WHERE ID_Evento = %s"
        cursor.execute(verifica_evento_query, (evento_id,))
        evento = cursor.fetchone()
        if not evento:
            raise HTTPException(status_code=404, detail="Evento non trovato")
        
        # Verifica se l'utente ha già prenotato per questo evento
        verifica_prenotazione_query = "SELECT * FROM prenota WHERE email = %s AND id_evento = %s"
        cursor.execute(verifica_prenotazione_query, (user, evento_id))
        prenotazione = cursor.fetchone()
        if prenotazione:
            raise HTTPException(status_code=409, detail="Hai già prenotato questo evento")

        # Inserisce la prenotazione
        query_prenotazione = """
            INSERT INTO prenota (email, id_evento, numero_ospiti)
            VALUES (%s, %s, %s)
        """
        
        # Stampa della query di prenotazione per il debug
        print(f"Query di prenotazione: {query_prenotazione} con parametri: {user}, {evento_id}, {numero_ospiti}")
        
        cursor.execute(query_prenotazione, (user, evento_id, numero_ospiti))
        conn.commit()
        
        return JSONResponse({"message": f"Prenotazione effettuata per l'evento con ID {evento_id} per {numero_ospiti} ospiti"})
    
    except mysql.connector.Error as err:
        # In caso di errore durante l'esecuzione della query, restituiamo un errore 500
        print(f"Errore database: {err}")  # Puoi anche stampare l'errore per il debug
        return JSONResponse(content={"error": f"Errore durante la prenotazione: {err}"}, status_code=500)
    
    finally:
        if 'cursor' in locals():
            cursor.close()




# Route per verificare lo stato della sessione
@app.get("/utente_me")
async def utente_me(request: Request):
    user = request.session.get("user")
    if user:
        return JSONResponse({"message": f"Sei loggato come {user}"})
    else:
        raise HTTPException(status_code=401, detail="Non sei loggato") 

# Route per il logout
@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return JSONResponse({"message": "Logout effettuato con successo"})