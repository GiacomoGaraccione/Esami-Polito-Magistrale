# Guida Lab1

## Lanciare OS161

`cd $HOME/pds-os161/root`
`sys161 kernel` 

## Modificare il Kernel

Tutti i file da modificare per lavorare su OS161 sono nella cartella `os161`.

Per creare `kern/main/hello.c` è importante copiare tutti gli `#include` presenti in un altro file (ad esempio, `kern/main/main.c`), così da evitare errori durante la compilazione.

Funzione da inserire:

void hello(void){
    kprintf("Hello\n");
}

Per creare `kern/conf/HELLO` basta semplicemente copiare il file `DUMBVM` nella stessa cartella, aggiungendo però in fondo al nuovo file la riga `options hello` (servirà con le azioni fatte dopo a distinguere il kernel che stampa hello da quello che non lo fa).

Una volta tutto pronto si può compilare (in `kern/compile/HELLO`) eseguendo in ordine (importante, altrimenti da errore):

1. `bmake depend`
2. `bmake`
3. `bmake install`

## Threads

Per lanciare il debugger gdb con un kernel diverso da quello standard si deve modificare il file `pds-os161/root/.gdbinit`, aggiungendo una nuova opzione come

`def dbos161t`
  `dir ../..os161/os161-base-2.0.2/kern/compile/THREADS`
  `target remote unix:.sockets/gdb`
`end`

mettendo poi `dbos161t` come ultima riga del file (in questo modo il debugger verrà automaticamente lanciato con il kernel `THREADS`)