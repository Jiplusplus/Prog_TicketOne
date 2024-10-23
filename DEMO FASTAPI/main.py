from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import mysql.connector
from fastapi import FastAPI, Request
app = FastAPI()
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

@app.get("/get_evento")
async def get_evento(id : int):
    print("ID da cercare");
print("id");