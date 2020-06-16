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

- per lanciare nodemon usare il comando 'npx nodemon server.js' (come fare per avere contemporaneamente client e server che runnano?)
- creati file in /server per gestione del caricamento dati da db e futura interazione con il client

## Next steps (immediati)

- Capire il meccanismo delle Route per poter visualizzare le diverse pagine in base all'URL (per ora si vede la stessa pagina sia con localhost:3000 che con localhost:3000/guaste)
- Capire come ottenere le informazioni su tutti i veicoli(forse riuscito grazie ai file in /server) e come mostrarle nella homepage (richiede interazione tra file diversi e quindi studio su github)

## Next steps (più lontani)

- Gestione del login(in teoria /server/user_funcs ha già parti di codice per occuparsene, ovviamente va testato e rivisto)


