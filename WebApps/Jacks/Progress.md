# Exam 29/06/2020

## 12/6/20

- Installato correttamente il progetto con npx
- Iniziato lavoro su /client/src/App.js

## 13/6/20

- /client/src/App.js: trovato modo per posizionare correttamente tasto Login e tabella con le informazioni (App.css)
- creato /client/src/api/Vehicle.js. Contiene la creazione di un oggetto Vehicle partendo da un JSON
- creato /client/src/api/API.js. Aggiunto solo la getVehicles, chiamata poi in App.js
- trovato link per tabella con filtri con React (https://codesandbox.io/s/r40ovqp5jq?file=/index.js)

## 14/6/20

- per lanciare nodemon usare il comando 'npx nodemon server.js'
- creati file in /server per gestione del caricamento dati da db e futura interazione con il client

## 23/6/20 (cazzo manca poco tempo aaaaaaaaaaaaaa)

- Grazie ai soci FedeSchiavo e DiddyCN: impostata meglio la pagina iniziale e creato un tasto Login che non fa sboccare se lo vedi
- titolo messo al centro della homepage (in modo un po' becero)
- ABBIAMO LE ROUTE DIO CANEEEEEEEEEEEEEEEEEEEEEEEE
- di conseguenza, il tasto login manda ad una nuova pagina (da riempire) e ogni pagina ha il titolo cliccabile per ritornare alla homepage
- se 'nodemon server.js' si blocca per via di un errore cercare il processo in ascolto su 3001 usando 'netstat -o -n -a 3001' (su terminale Windows anzichè su Git Bash)

## 24/6/20 

- sistemata la query sql per prendere tutte le macchine dal db
- tabella fatta (seeeeeeh porcoddiooooooooooooooooooooooooooo)
- query sql per avere tutte le marche distinte (inclusa API per averle nello state di App.js)
- filtri per categoria finiti
- filtri per marca finiti (e grazie al cazzo, CTRL+C CTRL+V adattando al caso Brand)
- interazione tra filtri da fare (ora ogni filtro opera indipendentemente)
  
## 25/6/20

- i filtri interagiscono "bene" (c'è da rivedere l'algoritmo ma se dedico il tempo solo a quello mi posso anche arrendere)
- layout della pagina di login pronto (da abbellire come tutto il resto perchè al momento fa schifo a Cristo)

## 26/6/20

- login fatto(anche se c'è da rivedere l'interazione con il link per tornare alla home, visto che esegue un logout implicito)
- creata la pagina del configuratore, vedere come si fa per mostrare i veicoli liberi e calcolare prezzi
- Il configuratore è in grado di calcolare i veicoli disponibili e di mostrarli correttamente
- Calcolo dei prezzi implementato (sni, manca il calcolo dell'extra se ci sono pochi veicoli e lo sconto per user frequente non funziona)
- Aggiornato calcolo prezzi(sconto user frequente funziona)
- Calcolo prezzi finito
  
## 27/6/20

- Aspetto non più osceno
- Aggiunta conferma di rent e pagamento con API (rivedere API di inserimento in tabella di nuovo rent)
- Iniziato a lavorare su pagina dei rent

## 28/6/20 (MADONNAAAAAAAAAAAAAAAA oggi ci giochiamo tutto Renato)

- Pagina dei rent completata (ovvero, mostra i rent senza fare distinzioni tra passati, correnti e futuri)
- Filtri corretti (grazie DiddyCN)

## Next steps (immediati)

- Logout e cookie per il login
- Sistemare le navbar per le varie pagine

  
## Next steps (più lontani)

- Ormai siamo all'ultimo giorno
- Rivedere tutto e assicurarsi funzioni


