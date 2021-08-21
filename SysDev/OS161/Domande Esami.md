# Domande Esami OS Internals

## 10-07-2020

### Domanda 1

Sia dato un disco organizzato con blocchi fisici e logici di dimensione 8KB. Il disco contiene più partizioni: la partizione A, di NB blocchi, è formattata per un file system che alloca staticamente NMB blocchi per i metadati (che includono directory, file control blocks e una bitmap per la gestione dello spazio libero) e NDB blocchi per i dati dei file. La bitmap ha un bit per ciascuno degli NDB blocchi di dati. NMB/4 blocchi di metadati sono riservati alla bitmap.

#### Calcolare il rapporto NDB/NMB

|bitmap| = NMB/2 blocchi = (NMB/4) * 8K * 8bit = 16Kbit * NMB
Ogni bit della bitmap corrisponde ad un blocco di dati di NDB => NDB = 16K blocchi * NMB

NDB/NMB = 16K

#### Supponendo che la bitmap indichi un rapporto blocchi liberi / usati del 25% (quindi 1 blocco libero ogni 4 usati), si calcoli (in funzione di NMB) la dimensione massima per un intervallo contiguo di blocchi liberi, assumendo la configurazione più favorevole della bitmap. Si dia la stessa risposta anche assumendo la configurazione della bitmap meno favorevole.

Nfree/Nocc = 0.25
Nfree = 0.2*(Nfree + Nocc) = 0.2*Nbits = 0.2 * 16Kbit * NMB = 3.2 Kbit * NMB

Nbest = 3.2 K * NMB (tutti i blocchi liberi sono contigui)
Nworst = 1 (nessun blocco libero ne ha uno libero adiacente)

#### Si supponga che un file control block (FCB) abbia dimensione 256B e NMB/4 blocchi di metadati siano riservati agli FCB, per un massimo di 16K file. Si calcolino NDB, NMB e NB. Si esprima anche la dimensione della bitmap e della partizione A, espressa in Byte.

Un blocco può contenere fino a 8KB/256B = 32 FCB
=> numero massimo di FCB = 32 * NMB/4 = 8 * NMB
Siccome un FCB corrisponde ad un file Nfile = 8 * NMB = 16K => NMB = 2K
NDB = 16K * 2K = 32 M
NB = NDB + NMB = 32M + 2K
|A| = (32M + 2K)*8KB = 256GB + 16MB
|bitmap| = NMB/4 * 8KB = 2K/4 * 8KB = 4MB

### Domanda 2

#### Si consideri il caricamento dinamico (dynamic loading) e il link dinamico (dynamic linking). È possibile caricare dinamicamente un programma senza cha sia necessario il dynamic linking?
Si, non è obbligatorio eseguire entrambe le operazioni insieme. (Un programma può, ad esempio, essere linkato staticamente e caricato in modo dinamico)

#### Il dynamic linking richiede che un programma sia anche caricabile dinamicamente (dynamic loading)?
No, il dynamic loading può usufruire del dynamic linking ma non è necessario.

#### Si spieghi brevemente perché un’Inverted Page Table necessiti di un campo pid (ID del processo) in ciascuna delle sue entry, mentre ciò non è vero per una tabella di pagine standard.
Perchè è condivisa da tutti i processi, e ha dunque bisogno del campo PID per distinguere i processi a cui appartengono i diversi indirizzi da tradurre, essendo mappata sulla memoria fisica anzichè su un determinato processo. Siccome le sue entries sono coppie pagina-frame e diversi processi potrebbero avere lo stesso campo pagina, anche se associato a frame diversi, è necessario avere il pid per distinguere il processo di appartenenza.

#### Si consideri una CPU dotata di TLB: la TLB può contenere entry di più processi o è vincolata a contenere entry per un solo processo?
Esistono entrambi i tipi di TLB: quelle contenenti entry per più processi e quelle contenente solo entry per il processo attualmente attivo, le quali necessitano di funzionalità di azzeramento/reset in corrispondenza di ciascun context switch

#### Sia data una CPU a 64 bit, la quale gestisce indirizzi fisici di soli 42 bit e paginazione gerarchica, indirizzi logici a 64 bit suddivisi in (p1, p2, d), di dimensioni (42,12,10) bit, rispettivamente. Si calcoli il numero minimo di bit necessari per una entry nella TLB, considerando che ogni entry di TLB include i bit di "validità", "modifica" e 3 bit di protezione della pagina.
Una entry di TLB contiene (p, f), dove p = pagina (compresi sia p1 sia p2)e f = frame, oltre ai bit aggiuntivi (validità, modifica, protezione)
|f| = 42-10 bit (indirizzo fisico - offset dell'indirizzo logico dato da d)
|TLB-entry| = 42+12+32+5 = 91 bit

### Domanda 3
Si considerino tre kernel thread in OS161, i quali implementano un'attività di trasferimento dati basata sul modello produttore/consumatore (due produttori, un consumatore). I thread condividono una struttura C di tipo struct prodCons definita come segue:
    #define NumP 2
    struct prodCons {
     int cnt[NumP];
     int size[NumP];
     struct lock *pc_lk;
     struct cv *pc_cv;
     … /* data buffer handling – omitted */
    };

Il produttore i (con i = 0 oppure 1) aggiorna le i-esime entry nei vettori `cnt` e `size`, il consumatore legge entrambi i vettori. Il lock viene utilizzato per la mutua esclusione sui vettori condivisi. Prima di lavorare sui dati, il consumatore deve attendere che una condizione sia vera: ossia che `(cnt[0]+cnt[1]) > minCnt` oppure che `(size[0]+size[1]) > minSize`; questo avviene chiamando la funzione: 
`void consumerWait(struct prodCons *pc, int minCnt, int minSize);`

#### La struttura condivisa può essere posizionata nello stack di thread o dovrebbe essere una variabile globale o altro?
Ogni thread ha il proprio stack esclusivo, in cui gli altri non possono accedere e dove non si possono quindi salvare variabili condivise; la struttura condivisa dovrebbe essere quindi gestita tramite variabile globale.

#### Dato che i campi pc_lk e pc_cv sono puntatori, dove dovrebbero essere chiamate lock_create() e cv_create()? Nei thread produttori, nel thread consumatore? Altrove?
Le funzioni potrebbero essere chiamate direttamente nel thread principale, responsabile della creazione di produttori e consumatore prima della loro creazione, oppure da uno di questi, prestando però attenzione alla sincronizzazione tra thread (il primo thread a raggiungere un determinato punto chiama le funzioni mentre gli altri aspettano, dopodichè tutti eseguono i rispettivi compiti).

#### Si fornisca un'implementazione della funzione consumerWait. Non è necessario alcun codice produttore e/o consumatore, solo la funzione.

    void consumerWait(struct prodCons *pc, int minCnt, int minSize){
        //acquisizione del lock necessario per controllare la condition variable
        lock_acquire(pc->pc_lk);
        //while anzichè if perchè le condizioni potrebbero essere modificate da uno dei due thread produttori prima che il consumatore possa procedere
        while((pc->cnt[0] + pc->cnt[1]) <= minCnt && (pc->size[0] + pc->size[1]) <= minSize){
            cv_wait(pc->pc_cv, pc->pc_lk);
        }
        //rilascio del lock 
        lock_release(pc->pc_lk);
    }

### Domanda 4

Si consideri una possibile implementazione delle system call `open()` e `close()` in OS161. La chiamata di sistema `open()` è implementata dalla una funzione `sys_open()`, che internamente ha la seguente istruzione:
`err = vfs_open(name, flags, &vn);` 

#### vn (ossia vnode) è un puntatore o una struttura C?
vn è un puntatore dichiarato come `struct vnode *vn;`; non può essere una struttura perchè `vfs_open` restituisce by pointer (tramite &) un puntatore a un vnode, allocato in una tabella apposita, anzichè una copia del vnode.

#### Si supponga che due processi user chiamino open() per lo stesso file, ci si aspetta che:
1 - ogni vfs_open creerà un nuovo vnode, copiato in vn
2 - ogni vfs_open creerà un nuovo vnode, il cui puntatore verrà restituito in vn
3 - solo un vnode verrà creato e copiato in vn (quindi ne avremo due copie)
4 - verrà creato solo un vnode e il puntatore ad esso sarà restituito in vn (quindi avremo due puntatori allo stesso vnode)

Verrà creato solo un vnode e il puntatore ad esso sarà restituito in vn (due puntatori allo stesso vnode); 1 e 3 non possono essere corrette perchè `vfs_open` restituisce un puntatore a vnode e non una copia, 2 non può essere corretta perchè può esistere un solo vnode per un determinato file: aprire più volte lo stesso file con processi concorrenti farà creare un solo vnode (prima chiamata a `open()`), che verrà poi referenziato in aperture successive.

#### La tabella di sistema dei file aperti è implementata come segue
    /* system open file table */
    struct openfile {
     struct vnode *vn;
     off_t offset;
     unsigned int countRef;
    };
    struct openfile systemFileTable[SYSTEM_OPEN_MAX];

##### Perché `struct openfile` include un contatore di riferimenti (`countRef`), mentre i vnode hanno già internamente un contatore di riferimenti? È un duplicato?

Perchè sia un `vnode` che una `struct openfile` possono essere condivisi, il primo da più entry in `systemFileTable`, la seconda da più entry nella process file table, dato uno stesso file condiviso.

##### È possibile che una determinata entry nell'array systemFileTable sia condivisa (puntata) da due processi diversi?
Si, può capitare ad esempio durante il fork di un processo quando, subito dopo la generazione del processo figlio, le process file table dei processi padre e figlio (due tabelle distinte) puntano a voci condivise, con i campi `countRef` incrementati durante la fork.

### Domanda 5
    #define N 256
    float M[2*N][N],V[2*N*N];
    int i,j,k,t;
    ...
    for (i=t=0; i<2*N; i++) {
     k = (i<N) ? N-i : i-N+1;
     for (j=0; j<k; j++) {
      V[t++] = M[i][j];
     }
    }

Il codice macchina generato da tali istruzioni viene eseguito su un sistema con gestione della memoria basata su demand paging (paginazione a richiesta), pagine da 1KB, utilizzando una politica di sostituzione pagine working set (versione esatta) con delta=10.
Si sa che la dimensione di un float è di 32 bit, il segmento di codice (istruzioni in codice macchina) ha dimensioni inferiori a una pagina, M e V sono allocati ad indirizzi logici contigui (prima M, poi V), a partire dall'indirizzo logico 0xA720C400, la matrice M è allocata seguendo la strategia "row major", ovvero per righe (prima riga, seguita da seconda riga, ecc..)

#### Quante pagine (e frame) sono necessarie per contenere la matrice e il vettore?

|V| = 2 * 256 * 256 * sizeof(float) = 2 * 256 * 256 * 32bit = 2 * 64K * 4B = 512KB/1KB pagine = 512 pagine
|M| = |V| = 512 pagine
L'indirizzo di partenza 0xA720C400 NON è multiplo della dimensione di una pagina (termina con 10 zeri, mentre dovrebbe terminare con 11 bit a zero), inizia invece a ½ di pagina (4 in binario è 0100).
=> V si sovrappone a 513 pagine e M a 513 pagine (la prima condivisa con V) => 1025 pagine in totale.

#### Le variabili i, j, k e t sono allocate in registri della CPU (accedendo a tali registri non si fa quindi alcun accesso in memoria RAM), quanti accessi totali a memoria Nt = Nw +Nr (Nr per la lettura e Nw per la scrittura di dati) produce il programma proposto (non vanno conteggiati gli accessi a istruzioni)?

for(i=t=0;...) => 2*N = 512 iterazioni esterne
k varia da N-1 a 0 (prime N iterazioni), e poi da 0 fino a N-1 (ultime N iterazioni)
for(j=0; j< k;... ) => iterazioni interne = 2*SUM(k) = 2 * N * (N+1)/2 = N * (N+1) = 256 * 257 = 65792
V[t++] = M[i][j] => 1 lettura per ogni iterazione (su M), 1 scrittura per ogni iterazione (su V)
Nw = 65792
Nr = 65792
Nt = Nw + Nr = 131584

#### Sia Nt la quantità totale di riferimenti a dati in memoria (omettiamo per semplicità il fetch delle istruzioni) e sia Nl il numero di riferimenti (tra gli Nt totali) a una pagina già letta nei precedenti 10 accessi. Definiamo come località del programma per i dati il rapporto L = Nl/Nt . Si calcoli la località del programma proposto.
Ogni riga di M si sovrappone a due pagine, poiché la prima pagina contiene solo metà della prima riga e l'ultima riga è condivisa con V. Non tutte le celle di M vengono lette, ma tutte le pagine di M vengono lette almeno una volta => l’unico accesso non locale è il primo a ogni pagina.

V è scritto sequenzialmente, ma non completamente: solo per le prime N celle, con N = 256*257. V condivide (metà e metà, quindi 1/2 KB = 128 float) la prima pagina con M. Le pagine rimanenti ammontano a ceil ((N - 128) / 256) = ceil (256,5) = 257 pagine.

Le due prime righe sono nella stessa pagina dell'ultima pagina di M. Per tutte le pagine a cui si accede, si ha solo un accesso non locale (la pagina condivisa da M e V ha 2 accessi non locali, uno durante la scrittura di V e uno durante la lettura di M)
Nnl = 513 (pagine di M) + 1 (pagina di V condivisa con M) + 257 (altre pagine di V) = 771
Nl = Nt – Nnl
L = Nl /Nt = (Nt – Nnl )/Nt = 1 – Nnl/Nt = 1 – 771/(512*257) = 1 – 0.0059 = 0.9941

#### Si calcoli il numero di page fault generati dal programma
Si ha un page fault per ogni accesso non locale => Npf = 771

## 27-06-2020

### Domanda 1
Consider a virtual memory system based on paging, with a byte addressable RAM. The system has a TLB (Translation Look-aside Buffer), with an experimentally measured hit ratio of 97%. A two level page-table is used, based on splitting a 64-bit logical address (from MSB to LSB) into 3 parts: p1, p2 and d, respectively of 40 bits, 12 bits, and 12 bits. No other data structures (such as hash tables or inverted page tables) are used. Virtual memory is managed with demand paging.

#### Assuming the RAM memory has an access time T = 250 ns, calculate the effective access time (EAT) for the proposed case (TLB hit ratio = 97%), assuming that the TLB lookup time is negligible.
EAT = (hit rate * T) + ((1 - hit rate) * 3 * T) = (0.97 * 250 ns) + (0.03 * 3 * 250 ns) = 265 ns

#### Consider the page fault frequency p. Assuming that a page fault is served in 7 ms, what value should p take in order to guarantee a maximum performance decrease of 20% for EAT (caused by both the TLB and the page faults) with respect to T ? Is this a maximum or minimum value for p?
EATpf = (1-p) * EAT + p * Tpf = (1-p) * 265ns + p * 7*10^6 ns
EATpf <= 1.2 * Tram = 300ns
(1-p) * 265 + p * 7*10^6 <= 300
=> p <= 35/(7 * 10^-6) = 5 * 10^-6

It is a maximum value, since it is a (less than) condition, and also because if the probability of page faults increases EATpf also increases, which must be less than a maximum limit.

#### In order to evaluate a page replacement algorithm A, three reference strings w1 , w2 , w3 have been simulated / tested, having length, respectively, len(w1) = 10 , len(w2) = 2 * 10, len(w3) = 5 * 10^6 . The simulations generated 150, 100 and 75 page faults respectively. The three strings have probability (of representing a generic execution in the real system) p1 = 0.4, p2 = 0.2, p3 = 0.4. Compute the empirical probability f (expected frequency) of a page fault in the real system.
f = p1 * (pf1/w1) + p2 * (pf2/w2) + p3 * (pf3/w3) = 0.4 * (150/10) + 0.2 * (100/20) + 0.4 * (75/5 * 10^6) = 7.1 * 10^-5

### Domanda 2
An executable file contains three sections:
- a header of 3KB size,
- a text segment (program and other) of size 11MB,
- a (global) data segment of size 9.5 MB.
The file is saved in a file system F based on standard iNodes (10 direct pointers, 1 single indirect, 1 double, 1 triple), with 2KB size blocks and 32bit indexes (block pointers).

#### Is it necessary for the text segment and the data segment to begin at a block boundary (address multiple of the block size)?
No, because the content of the file is independent from the filesystem and the disk on which it's stored and its format is processed at a higher level than the implementation of filesystem and IO.

#### What is the size (regardless of the file system) of the file and what is its occupation (measured in blocks) in the file system F?
|file| = |header| + |text| + |data| = 3KB + 11MB + 9.5 MB = 20995 KB = 20.5 MB
occ = 20995 KB / 2 KB = 10498 blocks

#### Compute internal fragmentation (for data blocks only).
frag = (11 * 1024 KB * 2) - 20995 KB = 20996 KB - 20995 KB = 1 KB (half of the final block)

#### How many index blocks are needed to represent the file? (Also say which levels they belong to, if single indirect, double and/or triple)
indexes per block = 2 KB / 4B = 512 indexes

Level 0:
- 10 direct pointers (10 data blocks)
- 0 index blocks

Level 1:
- 512 single indirect data blocks
- 1 index block

Level 2:
- 10498 - 512 - 10 = 9976 double indirect data blocks
- 1 outer index block + (9976/512) inner index blocks = 21 index blocks

=> total = 22 index blocks

#### Assuming the header and the text segment remain unchanged, what could the maximum size of the data segment be to avoid using the triple indirect level ?
(3 KB + 11 MB + size)/2 KB = 10 + 512 + 512 + 512
=> size = 502 MB

### Domanda 3

A user process wants to make an input from a character IO device using a polling strategy. To avoid a too long wait (in the polling loop) by the device driver, the author of the program executed by the user process is asked to directly poll the device using a reading loop, in the user program, of the device status register.

#### Is it possible to carry out this operation?
It's not possible because an IO device requires privileged instructions, with the CPU in kernel mode. A user process doesn't have access to the device and so can't read from the device status register, unless a suitable system call performing such operation is implemented.

#### Assuming that the device is associated with the keyboard and that it is managed in interrupt, is it expected that an interrupt will be generated for each character received or an interrupt for each “return" (i.e. enter / end of line)?
An interrupt is expected to be generated for each character, since the keyboard is a character device; buffering of characters in a row must be managed by software.

#### Given another block-managed IO device, is it possible that a single read (through read()) tries to acquire an array larger than a block?
Yes, it's possible, because the `read()` system call isn't constrained neither by the file format nor by the size of a block; if the array is larger than a block then multiple blocks will be acquired together.

#### Given the driver who performs the reading, will this operation be carried out by DMA (if possible) or not? Why?
Yes, if the DMA is available then it can be used to perform the reading; it will also improve performance, allowing the CPU to perform other work in parallel and also halving the number of data transfers done compared to programmed IO.

### Domanda 4
An OS161 system is given. Suppose you have added the following instructions to `kern/conf/conf.kern`
    defoption project
    optfile project syscall/project.c
and you have created the `PROJECT` file in `kern/conf`, copied from the `DUMBVM` file.

#### Tell if the actions described above, plus the execution in `kern/conf` of `./config PROJECT`, are sufficient for the optional file `syscall/project.c` to be compiled when you execute, in `kern/compile/PROJECT`, the commands
    bmake depend
    bmake
No, they aren't enough; in the file `PROJECT` it's also necessary to add the instruction `options project`, so that the file `project.c` can be considered as a file to be compiled with the other dependencies.

#### Which of the `project.h` and `opt-project.h` files is automatically generated by the command `./config PROJECT`? It is always generated, or only if in PROJECT the following instruction appears?
    options project
The file that is automatically generated is `opt-project.h`, and it is always generated, independently from the inclusion of the instruction reported above, since it is generated due to the definition of the corresponding option in the file `kern.conf`.

#### What does the file contain (the automatically generated one, referred by the previous question)?
The file contains a directive for the pre-compiler:
 #define OPT_PROJECT 1 
 #define OPT_PROJECT 0
where the constant has value 1 if in the `PROJECT` file the instruction `options project` is included and 0 if it isn't (signaling that the defined configuration uses or not the optional file `syscall/project.c`).

#### Suppose you insert in main.c the instruction `project_init()`. Taking into account that the `project_init()` function is implemented in the `syscall/project.c` file, how can the instruction be taken into consideration and compiled only in the kernel versions in which the project option is enabled?
To have conditional compilation of the instruction it is necessary to include in the `main.c` file's header the instruction 
 #include "opt-project.h"
and then, when calling the instruction, having it written as
 #if OPT_PROJECT
  project_init();
 #endif

### Domanda 5
An OS161 system is given, in the basic version. Consider the definitions of struct thread and struct proc, partially reported here:
    struct thread {
     char *t_name;
     ...
     void *t_stack;
     struct switchframe *t_context;
     struct cpu *t_cpu;
     struct proc *t_proc;
     /* add more here as needed */
    };
    struct proc {
     ...
     unsigned p_numthreads;
     struct addrspace *p_addrspace;
     struct vnode *p_cwd;
     /* add more here as needed */
    };

#### Say how the two struct are related/connected in case a process has more than one thread.
`struct proc` will have its field `p_numthreads` equal to the number of threads it is associated to (the field's value will also automatically increase by 1 every time a new thread is created and decrease by 1 every time a thread terminates); `struct thread` will have its field `t_proc` point to the `struct proc` corresponding to the thread that generated it (multiple threads created by the same process will all point to the same `struct proc`)

#### Say if, given a pointer p to a struct thread, it is possible to get the list of all other threads of the same process and print their names? If it is not possible, propose how to modify (add fields) to struct proc and/or struct thread, in order to carry out the operation (given a thread, list other threads og the same process). Write a kernel function printOtherThreadNames(struct thread *t) that does the work
It is not possible, because even if a thread can access its process through the pointer, the process structure contains only the number of threads created by it and no other information such as a list that can allow to find out the thread structures.

It would be possible to implement such strategy by adding a pointer in the process structure to the head of a list of threads:
    struct proc{
        /* add more here as needed */
        struct thread *p_threadsListHead;
    }

Then, each thread structure will also contain a pointer to the next thread in the list:
    struct thread{
        /* add more here as needed */
        struct thread *p_nextThreadInList;
    }

void printOtherThreadNames(struct thread *t){
    struct proc *p = t->t_proc;
    struct thread *iter_t;
    for(iter_t = p->p_threadsListHead; iter_t != NULL; iter_t = iter_t->p_nextThreadInList){
        kprintf(iter_t->t_name);
    }
}

#### Consider the struct proc. Explain why, although the p_addrspace field allows you to reach the stack pointer of a user process, also the struct thread contains a stack pointer. Is this a redundant information (there is only one stack to which the thread and indirectly the process point), or are they two different stacks?
They are two different stacks: the one pointed by `p_addrspace` is the user stack of the process, the one pointed by `t_stack` is the kernel stack, used for example to save the switchframe and the trapframe.

#### Briefly explain the role of the t_context pointer in the struct thread.
It points to the thread's switchframe, which allows to save/restore the context of the thread at each context switch (change of the thread running on the CPU).


## 19-06-2021 

## 15-02-2021