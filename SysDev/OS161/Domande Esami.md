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
Nfree = 0.2*(Nfree + Nocc) = 0.2*Nbits = 0.2 * 16Kbit * NMB = 3.2 Kbit * NMB (i blocchi liberi sono 1/5 del totali, dati dalla somma Nfree + Nocc)

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

#### Say if, given a pointer p to a struct thread, it is possible to get the list of all other threads of the same process and print their names? If it is not possible, propose how to modify (add fields) struct proc and/or struct thread, in order to carry out the operation (given a thread, list other threads of the same process). Write a kernel function printOtherThreadNames(struct thread *t) that does the work
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
    for(iter_t = p->p_threadsListHead; iter_t != NULL; iter_t = iter_t->p_nextThreadInList) {
        kprintf(iter_t->t_name);
    }
}

#### Consider the struct proc. Explain why, although the p_addrspace field allows you to reach the stack pointer of a user process, also the struct thread contains a stack pointer. Is this a redundant information (there is only one stack to which the thread and indirectly the process point), or are they two different stacks?
They are two different stacks: the one pointed by `p_addrspace` is the user stack of the process, the one pointed by `t_stack` is the kernel stack, used for example to save the switchframe and the trapframe.

#### Briefly explain the role of the t_context pointer in the struct thread.
It points to the thread's switchframe, which allows to save/restore the context of the thread at each context switch (change of the thread running on the CPU).


## 19-06-2021 On/Off

### Domanda 1
Consider the following string of page references, for a given process. 7, 6, 2, 7, 2, 3, 2, 6, 7, 4, 2, 2, 7, 6.

#### Simulate an LRU ((Least Recently Used) page replacement algorithm, with a limit of 3 available frames. Represent the resident set (physical frames containing logical pages) after each memory reference.
|      A       |   B   |   C   |   D   |   E   |   F   |   G   |   H   |   I   |   J   |   K   |   L   |   M   |   N   |   O   |
| :----------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|     Time     |   0   |   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |   9   |  10   |  11   |  12   |  13   |
|   Accesses   |   7   |   6   |   2   |   7   |   2   |   3   |   2   |   6   |   7   |   4   |   2   |   2   |   7   |   6   |
| Resident Set |   7   |   7   |   7   |   7   |   7   |   7   |   7   |   6   |   6   |   6   |   2   |   2   |   2   |   2   |
|              |       |   6   |   6   |   6   |   6   |   3   |   3   |   3   |   7   |   7   |   7   |   7   |   7   |   7   |
|              |       |       |   2   |   2   |   2   |   2   |   2   |   2   |   2   |   4   |   4   |   4   |   4   |   6   |
| Page Faults  |   *   |   *   |   *   |       |       |   *   |       |   *   |   *   |   *   |   *   |       |       |   *   |

#### Show page faults (references to pages outside the resident set) and compute their overall count.
Page faults are shown in the table above, and their overall count is equal to 9.

### Domanda 2
A given disk is organised with physical and logical blocks of given (same) size 4KB. The disk contains multiple partitions: partition A has size 1M blocks, and is formatted for a file system that statically allocates 1/8 of blocks for metadata (directories, file control blocks and a bitmap, for free space management), and 7/8 of blocks for file data. Every bit in the bitmap corresponds to one of the data blocks.

#### Compute the size of the bitmap, in bytes and blocks.
ND = (7/8) * |partition| = 7/8 M blocks = 896 Kblocks
|bitmap| = 896 Kbits = 896/8 KB = 112 KB (one bit in the bitmap for each data block)
|bitmap| = 112 KB / 4 KB = 28 blocks

#### We know that the bitmap shows a ratio free/used blocks of 50% (so 1 free block for 2 used/allocated). Compute the maximum size of a contiguous interval of free blocks, when assuming the most favourable bitmap configuration.
Nfree/Nused = 1/2 => Nfree = 1/3 * (Nfree + Nused) = ND * 1/3
The most favourable configuration is the one with all the free blocks contiguous => max = ND/3 = 896 K/3 = 305835 blocks 

### Domanda 3

#### Briefly explain the following file structures, within the framework of a given file system :
1. Sequence of bytes
   Files are viewed as a sequence of bytes
2. Simple record structure
   The record is a higher level abstraction than the byte and can be with fixed or variable length(text files with lines terminated by end-of-line (\n)). A file will appear as a sequence of records,
3. Complex structures, such as (for instance) index and relative files.
   Complex file structures include data and metadata, organized for example in headers and/or sections; an index file (or the first part of a file) contains a table with pairs (key, pointer) that allow efficient search, where the pointer points directly to the data in the data (relative) file or in the second part of the file.

#### Of all the above file structures, show whether they support sequential and/or direct (random) access.
1. Files structured with sequences of bytes support sequential access and, if the single byte to access is known, also direct access.
2. Files with fixed-length records allow both sequential and direct access (given the record number and size, the byte to be accessed is calculated) while variable-length records allow sequential access only
3. Files with a complex structure allow both sequential and direct access, as long as, for direct access, it is possible to efficiently access the index and/or the header in which to find the pointer to the data

#### Which of the following file allocation/implementation strategies can be used with the above listed structures (1, 2, and 3): contiguous allocation, linked list of blocks, FAT and indexed allocation?
All three file types are compatible with all listed allocation strategies, since they're managed at different levels (application level in the first case, file organization module and filesystem level for the second case)

### Domanda 4
Consider a user process on OS161.

#### Briefly explain the difference between the switchframe and the trapframe. Which one is used to start a user process? Which one to handle a system call? Which one for thread_fork?
Both structures are used to save the process context (registers, other information), the switchframe is used when changing the process running in the CPU with a context switch while the trapframe is used when in the context of a trap (still in context of a process but in kernel mode).
A user process is started using the trapframe.
A system call is triggered by a trap, and thus it is handled with the trapframe.
The function `thread_fork` uses the switchframe, because it prepares a thread ready to be put in the ready queue.

#### Is the switchframe allocated in the user stack or the kernel-level process stack?
It's allocated in the kernel stack, because it can't be visible while in user mode.

#### Can an IO device be mapped to the logical address 0x90000050? And to 0xB0070060?
IO devices must be mapped in kernel space and can't be read or written using the cache, since those operations are to be made only on the IO device; this means that they can only be mapped into kseg1, which isn't cached.
0x90000050 belongs to kseg0, which is cached, so it's invalid, while 0xB0070060 is in the range defined by kseg1, so it is a valid address for an IO device.

### Domanda 5
Consider an OS161 kernel.

#### Briefly describe the main features of semaphores and locks, and the main differences between them.
Both semaphores and locks are synchronization mechanisms: a lock is used to manage mutual exclusion from a critical section thanks to its ownership semantics (only one process/thread can own a lock at a time, others that try to own it are forced to wait for it to become available); a semaphore can also handle synchronization schemes and is implemented with a counter which defines the amount of processes/threads that can access the critical section at the same time.

#### What are wait_channels? Why are they used inside the kernel?
Wait channels are a synchronization primitive which allows `wait` and `signal` operations similar to the ones used with condition variables (wchan_sleep, wchan_wakeone, wchan_broadcast); they are, in fact, low level primitives associated to spinlocks in the same way in which condition variables are associated with locks. A wait channel can only be used by the kernel thread that has acquired the spinlock.

#### Is the following a possible prototype for function wchan_wakeone?
    wchan_wakeone(struct wchan *wc, struct lock *lk);
It's not a possible prototype because the second parameter shouldn't be a simple lock but a spinlock, because that's the one used by wait channels.

## 19-06-2021

## 15-02-2021

### Domanda 1
System of virtual memory with paging and Byte addressing, which also has a TLB (Translation Look-aside Buffer). The page table is implemented with a two-level scheme, where a 64 bit logical address is divided (from MSB to LSB) in 3 parts: p1, p2 e d; p2 has 14 bit and d 13 bit. There are no other data structures (hash tables or inverted page table) to speed up accesses. Virtual memory is handled with demand paging.

#### Assuming that the RAM memory has an access time of 160 ns, compute the TLB miss ratio needed to grant an EATpt <= 200 ns, assuming that the time needed to access the TLB is irrelevant. Is this value an upper bound or a lower bound for the TLB miss ratio?
EAT = (TLB hit rate * access time) + ((1 - TLB hit rate) * 3 * access time) (3 for the miss because of the two-level scheme)
h * t + (1-h) * 3 * t = EAT <= 200 ns
t(h + 3 - 3 * h) = 200 ns
t(3 - 2 * h) = 200 ns
3 - 2 * h  = 200 ns/160 ns
2 * h = 3 - 1.25
h = 1.75 / 2 = 0.875 (TLB hit rate)
miss rate = 1 -h = 0.125
The value obtained is a upper bound because a higher miss rate increases the EATpt.

#### Consider the page fault frequency pPF. An experimental evaluation shows that a page fault is served in 4 ms (on average) and that the prestation degradation (increase in execution time) caused by page faults is between 10% and 20%. Compute the range of values of pPF compatible with the experimental evaluation.
tPF = 4 ms
pPF * tPF = time increase
=> 0.1 < pPF * tPF > 0.2
0.1 < pPF * (4/200) * 10^6 > 0.2
0.1 < 2 * 10^4 * pPF > 0.2
5 * 10^-6 < pPF > 10^-5


#### A second experimental evaluation is made using two reference strings, w1 and w2, of length len(w1) = 10^6 and len(w2) = 2 * 10^2 and probabilities p1 and p2. Simulations have generated a total of 500 page faults (100 on w1 and 400 on w2) and estimated an empiric probability (expected frequence) f = 0.00013 to have a page fault in the real system. Compute the values of p1 and p2.
f = p1 * F1/len(w1) + p2 * F2/len(w2)
1.3 * 10^-4 = p1 * 100/10^6 + p2 * 400/2*10^6
1.3 * 10^-4 = p1 * 10^-4 + p2 * 2 * 10^-4
1.3 = p1 + 2 * p2
1.3 = 1 - p2 + 2 * p2
=> p2 = 1.3 - 1 = 0.3
p1 = 0.7

### Domanda 2
A disk is organized in physical and logical blocks of a given and equal size. The disk contains more partitions: the partition A is formatted with a file system that allocates statically NM=12.5K blocks for metadata (directories, file control block and a bitmap for handling free blocks), and ND=100M blocks for file data.

#### Compute the block size BS, considering that NM/4 blocks are reserved to the bitmap, that has one bit for each of the ND data blocks.
|bitmap| = ND/8 bytes = NM/4 * BS blocks
=> BS = ND/(2 * NM) = 100 M/25 K Bytes = 4 KB

#### We know that a file control block (FCB) has size 512B and NM/2 metadata blocks are reserved to FCBs. Compute the maximum number of files that can be stored in the file system.
NFmax * |FCB| = NM/2
=> NFmax = NM/(2 * |FCB|) = 12.5 Kblocks / (2 * (512 B / 4 KB) blocks) = 12.5 K * 4 = 50 K

#### Suppose that the bitmap shows a proportion blocks free/blocks used equal to 50% (1 free block for every two used blocks) and that 5 * 2^20 free blocks are "isolated" (preceeded and followed by an used block). Compute the size of the largest free block interval |LargestFree| in the most favourable and in the least favourable scenarios (sizes have to be expressed as numbers of blocks)
The bitmap has ND bits, 1 for each block; of these ND/3 are free (there's one free block for every two used block, meaning that 1/3 of blocks are free)

Most favourable: |LargestFree| = ND/3 - 5 M blocks = 28.3 M blocks (all the free blocks that aren't by definition "isolated" are contiguous)
Least favourable: |LargestFree| = 2 (all contiguous free blocks are allocated in couples and interleaved with occupied blocks)

### Domanda 3
Consider the optimizations implemented to improve overall performance of virtual memory management.

#### Briefly explain the COW (Copy on Write) technique: what is it and how does it improve memory management performance? Is the expected gain/improvement on time? On memory size? On both time and memory?
Copy on Write is a technique based on the idea that when a process is duplicated with a fork() operation the resulting processes, parent and child, both share the same memory region instead of having an exact copy of the memory used by the parent process made for the child; when one of the two processes has to perform a writing operation then the copy is done and the two memories differ. It improves both time, because the copying operation is done only when needed, potentially saving time if the two processes don't need to write, and also memory size, because memory is shared until one process writes, again saving space until needed.

#### Explain why the IO on a swap partition (backing store) is faster than file system IO (even if on the same device). Can the virtual address space of a given process be larger than the size of the swap area (size of the swap partition or file)?
It is faster because the swap space is allocated in larger chunks and less management is needed than file system.
It can be larger, as the swap space just needs to provide storage for the used pages, not foe the unused ones.

#### What is the role of the modify (dirty) bit associated to a page? Is the modify (dirty) bit just stored in the page table or is it also stored in the TLB (when available in a given processor)?
The dirty bit keeps track of the state of a page in respect to its copy on disk or to a given time interval of observation; it can also be stored in the TLB, allowing for best performance since in case of a TLB hit there's no need to access the page table, but hardware support in order to do so is required (setting the bit when writing the page).

### Domanda 4
Si considerino tre kernel thread OS161 che realizzano un lavoro di trasferimento dati di tipo produttore/consumatore (1 produttore, 2 consumatori). I thread condividono un buffer per i dati, implementato come un struct C di tipo struct prodConsBuf definita come segue:
    struct prodConsBuf {
     data_t data;
     int dataReady;
     struct lock *pc_lk;
     struct cv *pc_cv;
    };
Quando non ci sono dati presenti nel buffer, il flag dataReady vale 0. Quando il produttore scrive un nuovo dato (puntato da dp) nel buffer (campo data), pone il flag dataReady a 1 e invia un segnale a entrambi i consumatori con la funzione `void producerWrite(struct prodConsBuf *pc, data_t *dp);` mentre i consumatori chiamano iterativamente la funzione `void consumerRead(struct prodConsBuf *pc, data_t *dp);`. Quando i consumatori ricevono un segnale, solo uno dei due può trovare il flag dataReady al valore 1, quindi legge il dato (copiandolo dal buffer alla memoria puntata da dp), azzera il flag, infine ritorna/esce dalla funzione consumerRead. Il consumatore che trova il flag dataReady al valore 0 non fa nulla e si rimette in attesa di un altro segnale. Il lock viene usato per mutua esclusione, la condition variable viene usata per le segnalazioni produttore-consumatore. Si consideri unicamente la sincronizzazione da produttore a consumatore: NON SI RICHIEDE CHE IL PRODUTTORE VERIFICHI CHE UN MESSAGGIO SIA LETTO CORRETTAMENTE DA UN CONSUMATORE. Si può quindi assumere che il produttore effettui una nuova chiamata a producerWrite dopo che il precedente dato è stato acquisito correttamente dai consumatori.

#### Can the shared structure be located into the thread stack, or should it be a global variable or other?
It should be a global variable, because variables stored into the stack of a thread can only be read/written by that thread, and so other threads wouldn't be able to interact with the shared structure if it was put in the stack of a single thread.

#### As the pc_lk and pc_cv fields are pointers, where should the lock_create() and cv_create() be called? In the producer thread, in the consumer threads? Elsewhere?
The two functions should be called by the main thread (the one that starts the producer and the two consumers), rather than one of the three working threads, so that they can start working without issues; another solution would be to synchronize the three threads so that one of them calls the two functions and the others wait, then they all begin working after creation.

#### Provide an implementation of functions producerWrite and consumerRead.
void producerWrite(struct prodConsBuf *pc, data_t *dp){
    lock_acquire(pc->pc_lk); //acquire lock for mutual exclusion, need to work on shared structure
    pc->data = dp; //copy data
    pc->dataReady = 1;
    cv_broadcast(pc->pc_cv, pc->pc_lk); //signal to consumer threads
    lock_release(pc->pc_lk); //release the lock
}

void consumerRead(struct prodConsBuf *pc, data_t *dp){
    lock_acquire(pc->pc_lk);
    while(!pc->dataReady){
        cv_wait(pc->pc_cv, pc->pc_lk);
    }
    dp = pc->data;
    pc->dataReady = 0;
    lock_release(pc->pc_lk);
}

### Domanda 5
Si consideri in OS161 una possibile implementazione delle system call relative al file system, basate su una tabella di processo e su una di sistema, definite come segue
    /* system open file table */
    struct openfile {
     struct vnode *vn;
     off_t offset;
     unsigned int countRef;
    };
    /* this is a global variable */
    struct openfile systemFileTable[SYSTEM_OPEN_MAX];
    ...
    /* user open file table: this a field of struct proc */
    struct openfile *fileTable[OPEN_MAX];

#### Why is systemFileTable a global variable, whereas fileTable is a field of struct proc?
systemFileTable is shared by all processes and is unique, so it must be a global variable, while every process has its own fileTable, which can be allocated inside the struct proc.

#### Suppose two user processes call open() for the same file, will there be two entries in the systemFileTable for the file, or just one entry (pointed to, thus shared, by the two processes)?
There will be two entries, because each process may have a different offset for reading/writing the file, meaning that a single entry can't be shared (a single entry in systemFileTable can only be shared as the result of a dup/dup2 system call).

#### We need to implement the support for the SYS_lseek system call. Which data structures will be affected by the implementation of the SYS_lseek system call?
    off_t lseek(int fd, off_t offset, int whence);
    lseek() repositions the file offset of the open file description associated with the file descriptor fd to the argument offset according to the directive whence as follows:
    SEEK_SET The file offset is set to offset bytes.
    SEEK_CUR The file offset is set to its current location plus offset bytes. 
    SEEK_END The file offset is set to the size of the file plus offset bytes.
1. the process file table? 
2. one entry of the systemFileTable (for a given call to lseek)?
3. multiple entries of the systemFileTable (for a given call to lseek)?
4. the vnode of the file?

Only one entry of the systemFileTable will be affected: more specifically, the one corresponding to the process that called lseek and for which the file offset is changed.

## 12-09-2020

### Domanda 1
Si consideri, per un dato processo, la seguente stringa di accessi alla memoria. Per ogni indirizzo (indirizzamento Byte, con indirizzi espressi in codice esadecimale) viene riportata anche l'operazione di lettura (R) / scrittura (W): R 33F5, R 2A64, W 0AD3, W 2E7E, R 08C8, W 13D1, R094E, R 3465, W 32A0, R 1BBA, W 0CE6, R 1480, R 3294, R 2AB8. Supponiamo che gli indirizzi fisici e logici siano rappresentati su 16 bit, la dimensione della pagina sia 2 KByte e 3C02 sia l'indirizzo massimo utilizzabile dal programma (il limite superiore dello spazio degli indirizzi).

#### Calcolare la dimensione dello spazio di indirizzamento (espressa come numero di pagine) e la frammentazione interna.
Page size = 2 KB = 2^11 => 5 MSB individuano indirizzo
3C02 = 0011 1100 0000 0010 => 00111 = 7 => lo spazio di indirizzamento è di 8 pagine

Frammentazione interna: ultima pagina usata fino al Byte di offset 100 0000 0010 = 1026 => complessivamente, 1027 bytes sono usati
Fram = 2KB - 1027B = 1021 KB

#### Calcolare la stringa degli accessi alle pagine.
Accessi: 
    R 33F5 = 0011 0011 1111 0101 => 00110 = 6
    R 2A64 = 0010 1010 0110 0010 => 00101 = 5
    W 0AD3 = 0000 1010 1101 0011 => 00001 = 1
    W 2E7E = 0010 1110 0111 1110 => 00101 = 5
    R 08C8 = 0000 1000 1100 1000 => 00001 = 1
    W 13D1 = 0001 0011 1101 0001 => 00010 = 2
    R 094E = 0000 1001 0100 1110 => 00001 = 1
    R 3465 = 0011 0100 0110 0101 => 00110 = 6
    W 32A0 = 0011 0010 1010 0000 => 00110 = 6
    R 1BBA = 0001 1011 1011 1010 => 00011 = 3
    W 0CE6 = 0000 1100 1110 0110 => 00001 = 1
    R 1480 = 0001 0100 1000 0000 => 00010 = 2
    R 3294 = 0011 0010 1001 0100 => 00110 = 6
    R 2AB8 = 0010 1010 1011 1000 => 00101 = 5
Accessi: 6, 5, 1, 5, 1, 2, 1, 6, 6, 3, 1, 2, 6, 5

#### Simulare un algoritmo di sostituzione delle pagine di tipo PFF (Page Fault Frequency), assumendo un'unica soglia di tempo C = 2. Rappresentare il resident set (frame fisici contenenti pagine logiche) dopo ogni accesso alla memoria. Indicare esplicitamente le attivazioni dell'algoritmo (la procedura di selezione della vittima). Rappresentare anche (con un pedice o altra notazione) i bit di riferimento associati a pagine/frame.

|      A       |   B   |   C   |   D   |   E   |   F   |   G   |   H   |   I   |   J   |   K   |   L   |   M   |   N   |   O   |
| :----------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|    Tempo     |   0   |   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |   9   |  10   |  11   |  12   |  13   |
|   Accessi    |   6   |   5   |   1   |   5   |   1   |   2   |   1   |   6   |   6   |   3   |   1   |   2   |   6   |   5   |
| Resident Set |   6   |   6   |   6   |   6   |   6   | 6 (0) | 6 (0) |   6   |   6   | 6 (0) | 6 (0) | 6 (0) |   6   |   6   |
|              |       |   5   |   5   |   5   |   5   | 5 (0) | 5 (0) | 5 (0) | 5 (0) | 3 (0) | 3 (0) | 3 (0) | 3 (0) |   5   |
|              |       |       |   1   |   1   |   1   | 1 (0) |   1   |   1   |   1   | 1 (0) |   1   |   1   |   1   |   1   |
|              |       |       |       |       |       | 2 (0) | 2 (0) | 2 (0) | 2 (0) |       |       | 2 (0) | 2 (0) | 2 (0) |
|  Page Fault  |   X   |   X   |   X   |       |       |   X   |       |       |       |   X   |       |   X   |       |   X   |
|  Algoritmo   |       |       |       |       |       |   X   |       |       |       |   X   |       |       |       |       |

#### Mostrare i page fault (accessi a pagine esterne al resident set) e calcolare il loro conteggio complessivo.
I page fault sono mostrati nella tabella sopra, il loro numero complessivo è 7.

### Domanda 2
Considerare un file system Unix-like, basato su inode, con 13 puntatori / indici (10 diretti, 1 singolo indiretto, 1 doppio indiretto e 1 triplo indiretto). I puntatori / indici hanno una dimensione di 32 bit e i blocchi del disco hanno una dimensione di 2 KB. Il file system risiede su una partizione del disco di 400 GB, che include sia blocchi di dato che blocchi di indice.

#### Supponendo che tutti i metadati (eccetto i blocchi indice) abbiano dimensioni trascurabili, calcolare il numero massimo di file che il file system può ospitare, utilizzando l'indicizzazione indiretta singola (N1) e l'indicizzazione indiretta tripla (N3).
Indici per blocco: 2 KB/4 B = 512 indici
Totale blocchi: 400 GB/2 KB = 200 M blocchi

MIN1 = (10 + 1) blocchi dati + 1 blocco indice (occupazione minima con indicizzazione indiretta singola)
MIN3 = (10 + 512 + 512^2 + 1) blocchi dati + 1 (singolo) + 1 + 512 (doppio) + 1 + 1 + 1 (triplo) blocchi indice
     = 16 + 1024 + 512^2 = 1040 + 512^2

N1 = 200 M/MIN1 = 200M/12 = 17476266 = 16,66 M
N3 = 200 M/(1040 + 512^2) = 796

#### Dato un file binario di dimensione 20490.5KB, calcolare esattamente quanti blocchi indice e blocchi di dati occupa il file.
Blocchi dati: 20490.5 KB/2KB = 10246 blocchi
Framm. interna: 1 - 0.25 blocchi = 0.75 blocchi = 1536 B

Blocchi indice:
    Blocchi indice interni: 10246/512 = 21
    Blocchi indice esterni: 1 (doppio indiretto sufficiente)
    Totale: 21 + 1 = 22

#### Considerare lo stesso file della domanda precedente, su cui viene chiamata l'operazione lseek (fd, offset, SEEK_SET) per posizionare l'offset del file per la successiva operazione di lettura / scrittura. Supponiamo che fd sia il descrittore di file associato al file (già aperto), con offset = 0x00800010. Calcolare il numero di blocco logico (relativo ai blocchi di file, numerati a partire da 0) in corrispondenza del quale viene spostata la posizione. Se il file utilizza un'indicizzazione indiretta singola (o doppia / tripla), calcolare quale riga del blocco dell'indice esterno contiene l'indice del blocco di dati (o l'indice del blocco dell'indice interno).
Indice blocco dati: 0x00800010/2 KB = (8M + 2)/4K = 0x1000 = 4096
10 blocchi dati sono diretti
512 sono indiretti a livello singolo
=> Il blocco è al livello doppio indiretto

Indici esterni: (4K - 512 -10)/512 = 6

### Domanda 3
Rispondere alle seguenti domande sulla gestione della memoria.

#### Si Considerino gli algoritmi di scheduling del disco. Cosa ottimizzano gli algoritmi scan e C-scan e a quale tecnologia di disco si rivolgono?
Gli algoritmi scan e C-scan ottimizzano il tempo di ricerca (seek time) e la relativa distanza di ricerca necessari per servire un accesso in memoria in un disco di tipo HDD, riducendo la distanza che la testa del disco deve percorrere adottando una politica di tipo "ascensore", in cui si parte dalla posizione attuale e si procede verso un'estremità del disco (in modo sequenziale, dunque verso la fine del disco), servendo tutte le richieste incontrate lungo il tragitto anzichè servendole nell'ordine in cui vengono eseguite (scan prevede poi che la testa del disco continui in direzione opposta, C-scan adotta una strategia circolare in cui la testa riparte direttamente dall'inizio del disco).
Questi algoritmi sono pensati esclusivamente per dischi di tipo HDD, in quanto tecnologie con memoria non volatile non utilizzano dischi rotanti per accessi alla memoria, e dunque non hanno tempi di ricerca da ottimizzare.

#### Che cos'è la schedulazione noop e perché viene adottata con i dischi NVM (Non-Volatile Memory)?
La schedulazione noop sta per "no operation" e prevede che non venga adottata nessuna politica particolare per servire le richieste di accesso alla memoria; è adottata con dischi NVM poichè questi non hanno tempo di ricerca e quindi possono adottare una politica FIFO pura.

#### Si consideri un disco HDD con latenza di rotazione massima (tempo per un'intera rotazione del disco) 6 ms, tempo medio di seek 4 ms, un overhead del controller di 0,2 ms e velocità di trasferimento (transfer rate) 2 Gbit / s. Supponiamo che i blocchi del disco abbiano una dimensione di 8 KB, calcolare la velocità di rotazione (misurata in rpm, ovvero giri al minuto), la latenza di rotazione media (considerare mezza rotazione), il tempo di trasferimento per un blocco e il tempo di IO (complessivo) medio per trasferire 2 blocchi adiacenti (in una singola operazione I/O)
Velocità: 60s * 1/6 ms = 10000 rpm

Latenza rotazione media: 6 ms/2 = 3 ms

Tempo trasferimento 1 blocco: 8 KB/2 Gbit/s = 8 KB * 8 / 2 GB/s = 32 * 10^-6 = 0.032 ms

Tempo IO complessivo: Lat rotazione media + ricerca media + tempo trasferimento + overhead controller = 
                      3 ms + 4 ms + 2 * 0.032 ms + 0.2 ms = 7.264 ms

### Domanda 4
Si consideri la gestione della console in OS161 e le funzioni scritte di seguito.
    void putch_intr(struct con_softc *cs, int ch) {
     P(cs->cs_wsem);
     cs->cs_send(cs->cs_devdata,ch);
    }
    void con_start(void *vcs) {
     struct con_softc *cs = vcs;
     V(cs->cs_wsem);
    }

#### Quale delle due funzioni viene chiamata (direttamente) dalla funzione di console putch (int ch) e quale viene chiamata quando riceve un interrupt dalla console seriale?
`putch_intr` viene chiamata dalla funzione `putch`, poiché riceve il carattere da stampare, attende che la console seriale sia pronta `(P(cs->cs_wsem);)`, quindi chiama la funzione `cs_send` del driver del dispositivo della console. 
`con_start` viene attivata dall'interrupt hardware relativo alla console seriale che significa “console pronta a ricevere un nuovo output”, da qui la chiamata a `V(cs->cs_wsem)`; che segnala a putch_intr (in attesa) che un nuovo output può essere fatto.

#### Fornire la definizione del campo cs_wsem della struct con_softc
struct con_softc {
    ...
    struct semaphore *cs_wsem;
    ...
}

#### Fornire un'implementazione delle due funzioni, sostituendo il semaforo cs_wsem con una condition variable (definire anche i campi necessari in struct con_softc)

struct con_softc {
    ...
    struct lock *cs_wlk;
    int wready;
    struct lock *cs_wcv;
}

void putch_intr(struct con_softc *cs, int ch) {
    lock_acquire(cs->cs_wlk);
    while(!cs->wready){
        cs_wait(cs->cs_wcv, cs->cs_wlk);
    }
    cs->wready = 0;
    lock_release(cs->cs_wlk);
    cs->cs_send(cs->cs_devdata,ch);
}

void con_start(void *vcs) {
    struct con_softc *cs = vcs;
    lock_acquire(cs->cs_wlk);
    cs->wready = 1;
    cs_signal(cs->cs_wcv, cs->cs_wlk);
    lock_release(cs->cs_wlk);
}

### Domanda 5
Si consideri un processo utente su OS161.

#### Spiegare brevemente la differenza tra switchframe e trapframe. Quale viene utilizzato per avviare un processo utente? Quale per gestire una chiamata di sistema? Quale per la thread_fork?
Risposta [duplicata](#briefly-explain-the-difference-between-the-switchframe-and-the-trapframe-which-one-is-used-to-start-a-user-process-which-one-to-handle-a-system-call-which-one-for-thread_fork)

#### Lo switchframe è allocato nello stack utente o nello stack di processo a livello di kernel?
Risposta [duplicata](#is-the-switchframe-allocated-in-the-user-stack-or-the-kernel-level-process-stack)

#### Perché i dispositivi di IO sono mappati su kseg1? Sarebbe possibile mappare un dispositivo di IO in kseg0?
I dispositivi di IO sono mappati su kseg1 perchè non possono usare la cache per operazioni di lettura/scrittura, siccome queste operazioni possono essere eseguite solo con i dispositivi di IO, e kseg1 è la parte del kernel space che non è memorizzata nella cache. kseg0, pur essendo parte del kernel space, è memorizzato nella cache e quindi non può essere usato per mappare un dispositivo di IO.

#### Un processo utente può eseguire una write(fd, buf, nb), dove buf è un indirizzo in kseg0?
No, per mancanza di privilegi. In generale, qualsiasi indirizzo di memoria legale è valido come sorgente, ma per un processo utente un puntatore è legale solo se mappato nello user space (kuseg0), quindi kseg0 è invalido.

## 20-01-2020

### Domanda 1
Si consideri la seguente sequenza di riferimenti in memoria nel caso di un programma in cui, per ogni accesso (indirizzi in esadecimale, si indirizza il Byte), si indica se si tratta di lettura (R) o scrittura (W): R 315, R 3A4, R 465, W 343, W 241, W 3CE, R 3C8, W 2A0, R 42A, W 3E6, R 270, R 354, R 2B8, R 44E.

#### Supponendo che sia indirizzi fisici che logici siano su 12 bit, che si usi paginazione con pagine di dimensione 128 Byte e che il massimo indirizzo utilizzabile dal programma sia D20, si dica quante pagine sono presenti nello spazio di indirizzamento del programma e se ne calcoli la frammentazione interna.
Page size = 128 B = 2^7, indirizzi su 12 bit => 5 MSB identificano accesso

D20 = 1101 0010 0000 => 11010 = 16 + 8 + 2 = 26 pagine intere
010 0000 = 32 B => 1 pagina incompleta 
Totale: 27 pagine

Fram interna: 128 B - 32 B = 96 B

#### Si determini la stringa dei riferimenti a pagine (Si consiglia di passare da esadecimale a binario, per determinare correttamente il numero di pagina e, se necessario, il displacement/offset). Si utilizzi un algoritmo di sostituzione pagine di tipo LRU (Least Recently Used). Si assuma che siano disponibili 3 frame, agli indirizzi fisici (espressi in esadecimale) 580, 900, A80. Si richiede la visualizzazione (dopo ogni accesso) del resident set (i frame fisici contenenti pagine logiche). Indicare inoltre i page fault (accessi a pagine non presenti nel resident set).
Riferimenti:
    R 315 = 0011 0001 0101 => 6
    R 3A4 = 0011 1010 0100 => 7
    R 465 = 0100 0110 0101 => 8
    W 343 = 0011 0100 0011 => 6
    W 241 = 0010 0100 0001 => 4
    W 3CE = 0011 1100 1110 => 7
    R 3C8 = 0011 1100 1000 => 7
    W 2A0 = 0010 1010 0000 => 5
    R 42A = 0100 0010 1010 => 8
    W 3E6 = 0011 1110 0110 => 7
    R 270 = 0010 0111 0000 => 4
    R 354 = 0011 0101 0100 => 6
    R 2B8 = 0010 1011 1000 => 5
    R 44E = 0100 0100 1110 => 8  

|      A       |   B   |   C   |   D   |   E   |   F   |       |       |       |       |       |       |       |       |       |       |
| :----------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Riferimenti  |       |   6   |   7   |   8   |   6   |   4   |   7   |   7   |   5   |   8   |   7   |   4   |   6   |   5   |   8   |
| Resident Set |  580  |   6   |   6   |   6   |   6   |   6   |   6   |   6   |   5   |   5   |   5   |   4   |   4   |   4   |   8   |
|              |  900  |       |   7   |   7   |   7   |   4   |   4   |   4   |   4   |   8   |   8   |   8   |   6   |   6   |   6   |
|              |  A80  |       |       |   8   |   8   |   8   |   7   |   7   |   7   |   7   |   7   |   7   |   7   |   5   |   5   |
|  Page Fault  |       |   X   |   X   |   X   |       |   X   |   X   |       |   X   |   X   |       |   X   |   X   |   X   |   X   |

#### Si dica infine a quali indirizzi fisici vengono effettuati gli accessi (tra quelli sopra elencati) R 315, W 343, R 42A
580 = 0101 1000 0000
900 = 1001 0000 0000
A80 = 1010 1000 0000

Sommare i primi 5 bit (identificativi, calcolati sopra) del frame corrispondente con i rimanenti 7 (displacement) dell'indirizzo logico
R 315: frame 580 => 580 + 15 = 595 (0101 1 + 001 0101 = 0101 1001 0101)
W 343: frame 580 => 580 + 43 = 5C3 (0101 1 + 100 0011 = 0101 1100 0011)
R 42A: frame 900 => 900 + 2A = 92A (1001 0 + 010 1010 = 1001 0010 1010)

### Domanda 2
Sia dato un file system Unix, basato su inode aventi 13 puntatori (10 diretti, 1 indiretto singolo, 1 doppio e 1 triplo). I puntatori/indici hanno dimensione 32 bit e i blocchi su disco hanno dimensione 1KB. Si sa che il file system contiene N file per i quali è necessario indice indiretto triplo, 20*N file con indice indiretto doppio (non si sa nulla delle altre dimensioni). La partizione di disco riservata ai blocchi di dato ha dimensione 1 TB.

#### Si calcoli il valore limite per N, tale da garantire che tale partizione sia occupata al massimo per il 50%. Si tratta di un limite superiore o inferiore?
Indici per blocco: 1 KB/4 B = 256 indici

Per garantire che la partizione sia occupata al massimo al 50% è necessario porsi nel caso peggiore, cioè la dimensione massima, per i file che usino indici indiretti tripli (F3), come pure doppi (F2).

|F2|max = 10 + 256 + 256^2 blocchi
|F3|max = |F2| + 256^3 = 10 + 256 + 256^2 + 256^3

MAX = 0.5 * 1TB/1KB = 0.5 G blocchi = 512 M blocchi
20 * N * |F2| + N * |F3| < MAX
21 * (266 + 256^2) * N + 256^3 * N < 512 M
=> N < 29.56 => N <= 29

#### Si calcoli poi, assumendo che la partizione sia piena al 50% (e che N e 20*N siano, rispettivamente, i file con indirizzamento triplo e doppio), quale è il massimo numero di file possibili, nel file system, con indice indiretto triplo e doppio
In questo caso non occorre garantire il riempimento massimo, in quanto si sa già che la partizione è occupata al massimo al 50%. Per calcolare il numero massimo di file, occorre utilizzare l’occupazione minima:

|F2|min = 10 + 256 + 1 blocchi
|F3|min = 10 + 256 + 256^2 + 1 blocchi

20 * N * |F2| + N * |F3| < MAX
21 * 267 * N + 256^2 * N < 512
N < 7546.36 => N <= 7546

Numero max file con indirizzamento triplo: 7546
Numero max file con indirizzamento doppio: 20 * 7546 = 150927

#### Si calcoli infine, assumendo che la partizione sia piena al 50% (e che N e 20*N siano, rispettivamente) i file con indirizzamento triplo e doppio), quale è il massimo numeri di file possibili, nel file system, con indice indiretto singolo
Detto N1 il numero massimo di file richiesto, lo si raggiunge nel caso di occupazione minima per i file a indice indiretto doppio e triplo. Ipotizzando N>0, si assuma quindi N = 1 e dimensioni |F1|min, |F2|min e |F3|min, con |F1|min = 10 + 1 blocchi = 11 blocchi

(21 * 267 + 256^2) + 11 * N1 < 512 M
N1 < (512 M - 21 * 267 - 256^2)/11 = 48799979 ≈ 48,8*106 ≈ 46,5M

### Domanda 3
Esercizi risolti a lezione durante le esercitazioni, file `io-exercises.pdf`

### Domanda 4
Esercizi risolti a lezione durante le esercitazioni, file `os161-theory-exercises-2.pdf`

## 06-09-2019

### Domanda 1
Esercizi risolti a lezione durante le esercitazioni, file `memory-management-exercises-3.pdf`

### Domanda 2
Sia dato un file system, basato su FAT. I puntatori hanno dimensione 32 bit, i blocchi hanno dimensione 1KB, la FAT occupa 128 MB.

#### Quanti blocchi di dato possono contenere complessivamente, al massimo, i file presenti nel file system?
Nbl corrisponde al numero di indici che possono essere contenuti nella FAT.
Nbl = 128 MB/4B = 32 M

#### Quale è la dimensione complessiva massima dei file nel file system?
La dimensione complessiva massima dei file si ha se non è presente frammentazione interna e tutti gli indici della FAT sono occupati (puntano ad un blocco dati).

|Dim|max = 32 M * 1 KB = 32 GB

#### Quanti blocchi può contenere, al massimo, la free-list?
La free list può contenere il suo numero massimo di blocchi sono nel caso in cui non ci sia nessun file (FAT vuota)
|Free-list|max = 32 GB = 32 M blocchi

#### Sia dato un file “c.exe”. Si supponga che “c.exe” sia un file in formato ELF, contenente due segmenti (codice e dati). Il file inizia con un “executable header” di 52 Byte, seguito da due “program header” di 32 Byte ciascuno, quindi i due segmenti, rispettivamente di 6180 Byte e 8028 Byte. E’ necessario che ognuno degli header e dei segmenti inizi in un nuovo blocco di dati del file?
No, non è necessario, perchè il formato ELF e l'allocazione dei blocchi sono gestiti a due livelli diversi (applicazione per il primo, modulo filesystem del sistema operativo per il secondo)

#### Quanti blocchi di dati occupa il file “c.exe” nel file system proposto?
|c| = |eh| + 2 * |ph| + |s1| + |s2| = 52 + 32 + 6180 + 8028  B = 14324 B
|c|bl = 14324 B/1024 B = 14

#### Quale è la frammentazione interna di “c.exe”?
fram = |c|bl * |BL| - |c| = 14 * 1024 B - 14324 B = 12 B

### Domanda 3
Esercizi risolti a lezione durante le esercitazioni, file `file-system-exercises.pdf`

### Domanda 4
Esercizi risolti a lezione durante le esercitazioni, file `os161-theory-exercises-1.pdf`

## 24-07-2019

### Domanda 1
Esercizi risolti a lezione durante le esercitazioni, file `memory-management-exercises-3.pdf`

### Domanda 2
Sia dato un file system Unix, basato su inode aventi 13 puntatori (10 diretti, 1 indiretto singolo 1 doppio e 1 triplo). I puntatori/indici hanno dimensione 32 bit e i blocchi hanno dimensione 1KB. Si sa che il file system contiene N file (1000 ≤ N ≤ 10000), la cui dimensione complessiva (somma delle dimensioni dei singoli file, quindi indipendente dal tipo di file system) è 501MB. La frammentazione interna complessiva è 3 MB.

#### Il dato sulla frammentazione interna permette di limitare ulteriormente l’intervallo dei valori possibili per N?
La frammentazione complessiva va ripartita sugli N file. Pur potendo calcolare la frammentazione media, ogni singolo file potrebbe avere frammentazione di valore arbitrario (eventualmente 0). Il dato sulla frammentazione NON può quindi ridurre il valore massimo di N (10000) in quanto, dato un qualunque numero di file aventi frammentazione non nulla, se ne potrebbero aggiungere in numero arbitrario con frammentazione 0.

Si può però aumentare il valore minimo di N, siccome con N=1000 la frammentazione media sarebbe 3 MB/1000 = 3 KB circa, maggiore della dimensione del blocco.
N >= 3 MB/1023 KB = 3076 (frammentazione massima possibile per un file pari a 1 KB - 1 B)

#### Quale è il massimo numero di file, tra gli N presenti, ad utilizzare indice indiretto triplo?
Numero indici: 1 KB/4 B = 256 indici

|F3| = 10 + 256 + 256^2 blocchi (numero di blocchi dati necessari per un file con indice indiretto triplo) = 266 + 256^2 KB
N3 * |F3| < 501 MB => N3 < 501 MB/(266 + 256^2)KB = 501*4/257 = 7.8 circa
=> N3 = 7 files

#### Quale è il massimo numero di file, tra gli N presenti, ad utilizzare indice indiretto singolo?
|F1| > 10 blocchi = 10 KB
N1 * |F1| < 501 MB
=> N1 < 501 MB / 10 KB = 50.1 K
Siccome il risultato è maggiore del vincolo dato (N < 10000), il numero massimo di file con indice indiretto singolo è 10000.

#### Sia dato, in questo file system, un file testo “a.txt” contenente una sequenza di 10220 caratteri ASCII (a capo compresi) ripartiti su 200 righe. Quanti blocchi di dato occupa il file?
|a.txt| = 10220 B/1024 B = 10 blocchi

#### Se si modifica tale file mediante un editor di testi, spostando la prima riga, di 40 caratteri, in fondo al file (operazione cut-paste, taglia-incolla, cioè cancella all’inizio del file e aggiungi in fondo), la nuova versione di a.txt (dopo modifica e salvataggio della nuova versione del file) avrà un blocco di indici indiretto singolo oppure no?
No, perchè l'operazione sposta semplicemente una riga di una posizione, rimuovendo la prima e aggiungendone una copia in fondo al file, lasciando invariato il numero di righe del file e quindi la sua dimensione. Se l'operazione fosse stata un copia-incolla allora si sarebbe superata la dimensione minima (10 blocchi) per l'indicizzazione diretta, avendo quindi indicizzazione indiretta singola.

### Domanda 3
Sia dato un sistema con paginazione basato su Inverted Page Table (IPT).

#### Che cosa contiene una riga della IPT?
Contiene il PID del processo a cui appartiene la pagina e il numero di pagina logica p, più eventuali flag (protezione, modify, ...)

#### La dimensione della IPT dipende dalla dimensione della RAM oppure dagli spazi di indirizzamento dei processi in esecuzione? 
Dipende unicamente dalla dimensione della RAM, poichè contiene una entry per ogni frame fisico.

#### Confrontata con una tabella della pagine standard, quali sono i vantaggi egli svantaggi di una IPT?
Vantaggi:
* contiene soltanto le pagine associate a frame
* si ha una sola tabella per tutti i processi, riducendo lo spazio richiesto

Svantaggi:
* una IPT versione base ha tempo di ricerca lineare mentre una PT standard ha tempo di ricerca O(1)
* è difficile realizzare memoria condivisa perchè pagine diverse sono mappate sullo stesso frame

#### Perché può essere conveniente combinare una IPT con una tabella di hash?
Per ridurre i tempi di ricerca da lineari a O(1)

#### Si supponga di usare una tabella di hash basata su chaining (liste di collisione) per effettuare la conversione da (pid,p) a f, tale tabella può avere meno righe della IPT?
Si, perchè una tabella di hash con chaining non ha vincoli di dimensione, anche se questo ha però un impatto sulle prestazioni dipendente dal fattore di carico (numero dati/dimensione del vettore).

### Domanda 4
Esercizi risolti a lezione durante le esercitazioni, file `os161-theory-exercises-1.pdf` e `os161-theory-exercises-2.pdf`

## 05-07-2019

### Domanda 1
Esercizi risolti a lezione durante le esercitazioni, file `memory-management-exercises-1.pdf`

### Domanda 2
Esercizi risolti a lezione durante le esercitazioni, file `file-system-exercises-1.pdf`

### Domanda 3
Esercizi risolti a lezione durante le esercitazioni, file `file-system-exercises-1.pdf`

### Domanda 4
Sia dato un sistema operativo OS161.

#### Si supponga di aver definito l’opzione lab6 (defoption lab6) nel file conf.kern. Si vuole rendere opzionale (cioè compilata sono nel caso in cui sia abilitata l’opzione lab6) l’istruzione in linguaggio C (nella funzione boot): `Lab6Boot(”Aggiunta per LAB6”);` come occorre adattare il file main.c ?

/* main.c */
`#include <types.h>`
`#include <kern/errno.h>`
`...`
`#include <version.h>`
`#include "autoconf.h" // for pseudoconfig`
`#include ”opt-lab6.h” // oppure inserire questa riga in un .h già incluso`
`int boot (void) {`
`...`
`#if OPT_LAB6`
    `Lab6Boot(”Aggiunta per LAB6”);`
`#endif`
`...`
`}`

#### Si spieghi brevemente cosa sono switchframe e trapframe e a quale scopo vengono utilizzati.
Risposta [duplicata](#briefly-explain-the-difference-between-the-switchframe-and-the-trapframe-which-one-is-used-to-start-a-user-process-which-one-to-handle-a-system-call-which-one-for-thread_fork)

#### In quale parte della memoria virtuale/logica sono allocati i due frame? Memoria kernel o user?
Lo switchframe è nel kernel stack di un thread, il trapframe è un dato locale del kernel (quindi in uno stack kernel o nel kernel heap, qualora fosse allocato dinamicamente). Entrambi sono quindi in memoria kernel.

#### Di ognuno questi indirizzi logici, si dica se è plausibile (in un sistema OS161 con processore MIPS) come indirizzo iniziale di uno switchframe o trapframe

1. 0x7FFFFF00 - Invalido, in quanto indirizzo presente nello user space
2. 0x80044DB8 - Valido, in quanto indirizzo del kernel space
3. 0x80056B0A - Invalido, perchè pur essendo un indirizzo kernel non è un multiplo di 4 (registri possono essere salvati solo in frame allineati ad indirizzi multipli di 4)

#### Sia data la porzione della funzione load_elf rappresentata in figura, in cui si vuole leggere dal file ELF l’header del file, avente come destinazione la struct eh.
Risposta data a lezione durante le esercitazioni, file `os161-theory-exercises-2.pdf`

## 11-09-2018

### Domanda 1
Esercizi risolti a lezione durante le esercitazioni, file `memory-management-exercises-1.pdf`

### Domanda 2
Esercizi risolti a lezione durante le esercitazioni, file `file-system-exercises.pdf`

### Domanda 3
Esercizi risolti a lezione durante le esercitazioni, file `io-exercises.pdf`

### Domanda 4
Sia dato un sistema operativo OS161, di cui vengono riportate le funzioni thread_exit e thread_destroy.

thread_exit(void) {
    struct thread *cur = curthread;
    /* Detach from our process. You might need to move this action around, depending on how your wait/exit works. */
    proc_remthread(cur);
    /* Make sure we *are* detached (move this only if you're sure!) */
    KASSERT(cur->t_proc == NULL);
    /* Check the stack guard band. */
    thread_checkstack(cur);
    /* Interrupts off on this processor */
    splhigh();
    thread_switch(S_ZOMBIE, NULL, NULL);
    panic("braaaaaiiiiiiiiiiinsssss\n");
}

thread_destroy(struct thread *thread) {
    KASSERT(thread != curthread);
    KASSERT(thread->t_state != S_RUN);
    /* If you add things to struct thread, be sure to clean them up either here or in thread_exit(). (And not both...) */
    /* Thread subsystem fields */
    KASSERT(thread->t_proc == NULL);
    if (thread->t_stack != NULL) {
        kfree(thread->t_stack);
    }
    ...
    kfree(thread->t_name);
    kfree(thread);
}

#### Perché la thread_exit non ha parametri mentre la thread_destroy si?
Perchè `thread_exit` termina il thread corrente, mentre `thread_destroy` termina, deallocandone la struttura dati, un altro thread, di cui riceve il puntatore.

#### E’ possibile una delle seguenti sequenze di istruzioni?
    thread_exit();
    thread_destroy(thread);

    thread_destroy(thread);
    thread_exit();

La prima non è possibile, perchè dopo aver eseguito `thread_exit()` il thread corrente termina e quindi non è più possibile eseguire altre istruzioni, mentre la seconda è possibile, a patto che `thread` non sia la struttura thread associata al thread corrente.

#### Perché la thread_exit termina con una chiamata a panic, mentre la thread_destroy no?
Perchè fa terminare il thread portandolo in stato zombie, raggiungere la chiamata a `panic` corrisponderebbe ad un errore da parte del programmatore; la `thread_destroy`, invece, termina un altro thread e quindi può uscire regolarmente dalla funzione e continuare l'esecuzione.

#### Perché è possibile (si veda il commento) dover spostare la chiamata a proc_remthread(cur), effettuata in thread_exit, a seconda di come si realizza la wait/exit?
Perché le system call `exit` e `wait` debbono chiudere un processo, liberandone l’address space, ad esempio chiamando `proc_destroy`, e ciò richiede che preventivamente tutti i thread siano “staccati” dal loro processo. Siccome l’azione di staccare un thread dal relativo processo, così come fatto nella `thread_exit`, impedisce che vengano eseguite altre operazioni (rilascio di address space o segnalazione a processo in wait) dopo (perché il thread muore), è possibile che la `thread_exit` vada modificata (ad esempio accettando l’exit di un thread già staccato dal relativo processo).

#### Perché si fa l’asserzione KASSERT(thread->t_state != S_RUN)? Quale dovrebbe essere lo stato di thread?
Perchè non è possibile chiamare `thread_destroy` su un thread ancora in stato di esecuzione; un thread che può essere arrestato con tale funzione deve essere in stato zombie.

#### L’istruzione kfree(thread->t_stack)restituisce la RAM allocata per lo stack dell’address space associato al thread?
No, restituisce lo stato di kernel del thread; il rilascio dello stack dell'address space associato al thread deve essere fatto in `as_destroy`.

#### Si vuol realizzare il supporto per la system call read, di cui si fornisce il prototipo: `ssize_t read(int filehandle, void *buf, size_t size);`. Si scriva a tale scopo (e se ne spieghi in breve il contenuto) una funzione sys_read, richiamabile dalla syscall. Si richiede, in particolare, che la funzione permetta input da un file arbitrario (QUINDI NON LIMITATA a stdin). Una eventuale funzione di accesso a tabella dei file aperti può essere semplicemente chiamata (senza doverla realizzare).

int sys_read(int filehandle, userptr_t buf, size_t size) { 
    struct vnode *v; int result = 0; // la funzione va implementata gestendo opportunamente in open/close una tabella (un vettore) di puntatori a vnode per i file aperti
    v = getVnodeFromFileDescriptor(fd); 
    if (/* è la console */) { 
        // gestione standard input, ad esempio mediante kgets
    } else { 
        struct iovec iov; 
        struct uio u; 
        // funzione da realizzare (simile a uio_kinit, ma per spazio user)
        uio_uinit(&iov, &u, buf, size, 0, UIO_READ);
        result = VOP_READ(v, &u);
    } 
    return result; 
}

## 09-07-2018

### Domanda 1
Siano dati i frammenti di programma (A e B) rappresentati, che calcolano nel vettore V, rispettivamente, le medie per riga/colonna dei dati in una matrice triangolare inferiore/superiore M.
A: 
    float M[512][512],V[512];
    ...
    for (j=0; j<512; j++) V[j]=0;
    for (k=1; k<512 * 512; k=k * 2) {
        i = k/512;
        j = k%512;
        V[i] += M[i][j];
    }
    ...
B:
    float M[512][512],V[512];
    ...
    for (i=511; i>=0; i--) V[i]=0;
    for (k=512*512-1; k>0; k=k/2) {
    j = k/512;
    i = k%512;
    V[j] += M[j][i];
    }
    ...
I programmi eseguibili generati da tali sorgenti sono eseguiti in un sistema con memoria virtuale gestita mediante paginazione, con pagine di 1Kbyte, utilizzando come politica di sostituzione pagine la FIFO. Si sa che un float ha dimensione 32 bit e che le istruzioni in codice macchina, corrispondenti al frammento di programma visualizzato, sono contenute in una sola pagina. Si supponga i che M e V siano allocati ad indirizzi logici contigui (prima M, poi V), a partire dall’indirizzo logico 0x7474CB00. La matrice M è allocata secondo la strategia “row major”, cioè per righe (prima riga, seguita da seconda riga, …).

#### Quante pagine (e frame) sono necessarie per contenere la matrice e il vettore ?
|V| = 512 * sizeof(float) = 512 * 4 B = 2 KB => 2 KB/1 KB = 2 pagine
|M| = 512 * 512 * sizeof(float) = 1 MB => 1 MB/1 KB = 1 K pagine = 1024 pagine

Siccome l'indirizzo di partenza non è un multiplo della dimensione della pagina si usa una pagina in più => totale = 1027 pagine

#### Ipotizzando che le variabili i, j siano allocate in registri della CPU, quanti accessi in memoria (in lettura e scrittura) fanno il programma proposto, per accedere a dati (non vanno conteggiati gli accessi a istruzioni)?
A:
    for (j=0; j<512; j++)  512 iterazioni
        V[j]=0; 1 write
    for (k=1; k<512 * 512; k=k * 2) 18 iterazioni (log(512 * 512))
        V[j] += M[j][j] 1 write su V, 1 write su M, 1 read su V
    Totale: 512 + 3 * 18 = 566 accessi

B:
    Operazioni diverse ma numero di iterazioni e accessi uguale (566)

#### Detto NT il numero totale di accessi a dati in memoria, ed NL il numero di accessi a dati nella stessa pagina di uno dei precedenti 10 accessi, si definisca come località del programma per i dati il numero L = NL/NT. Si calcoli la località del programma proposto.
A:
    Tre accessi a V su 512 non sono locali (per l'allineamento degli indirizzi), 2 accessi a V nelle iterazioni su K sono non locali
    Gli accessi a M sono nella stessa pagina fino a k==8, si hanno quindi 1 + 9 accessi non locali.
    L = NL/NT = (566 - 15)/566 = 9.7
B:
    Tipo di accessi simile, i conteggi variano in modo trascurabile

#### Calcolare il numero di page fault generati dal programma proposto, supponendo che siano allocati per esso 10 frame, di cui uno utilizzato (già all’inizio dell’esecuzione) per le istruzioni.
In base alla politica e al numero di frame disponibili i page fault corrispondono con gli accessi non locali => PF = 15

### Domanda 2
Si consideri il problema della gestione dei blocchi liberi su un volume con file system, Si confrontino la soluzione mediante FAT e quella con bitmap (vettore di bit) per un sistema basato su iNode.

#### Si descrivano brevemente entrambe le soluzioni
Una bitmap è un vettore di bit, realizzato come vettore di byte perchè le RAM non forniscono indirizzamento al singolo bit, in cui un bit è associato ad ogni frame in RAM, con 0 = libero e 1 = occupato; inizialmente è su disco e viene copiata in RAM (memoria kernel).
Una FAT è un vettore di indici di blocchi in cui si realizzano liste concatenate, sia per blocchi allocati a file sia per una free list.

#### Ne si confronti l’efficienza nel caso di ricerca di un blocco libero, ricerca di N blocchi liberi contigui, allocazione di un N blocchi contigui
Per la bitmap la ricerca di uno o di N frame contigui liberi si effettua con un algoritmo lineare (O(NF), con NF numero di frame) e può essere agevolata da istruzioni efficienti di manipolazione e localizzazione di 0/1 e intervalli di 0/1 all’interno di una word. 
In una FAT la ricerca di un frame libero è O(1) (primo frame in lista). Per la ricerca di N frame contigui si possono considerare 2 casi:
* Liste non ordinate: la ricerca sarà O(NF2), in quanto per ogni frame libero si deve cercare, con una scansione lineare, altri eventuali frame contigui
* Liste ordinate: la ricerca sarà O(NF), ma per gestire la lista ordinata diventerà O(NF) (anziché O(1)) la liberazione di un frame, con inserimento in lista ordinata
L’allocazione di un intervallo di N blocchi contigui viene fatta, dopo la ricerca, modificando (con accesso diretto) i bit corrispondenti (0 o 1) nella Bitmap, oppure rimuovendo (per allocarli ai file) elementi nella free list, nel caso della FAT. Se la FAT è ordinata, si rimuove un intero intervallo (più semplice ed O(N), l’operazione è meno semplice con lista non ordinata (di fatto occorrerà fare una nuova ricerca, con rimozione di blocchi selezionati, e costo O(N*NF)).

#### Supponendo che ad un certo istante, su un volume da 200 GB, con blocchi di 2KB, ci siano 20M blocchi liberi, si calcoli la percentuale di FAT dedicata alla free list e la dimensione totale della bitmap.
N = 200 GB/2 KB = 100 M blocchi totali
%free = 20M / 100 M = 0.2 %
|Bitmap| = 100 M * 1 bit = 100 Mbit = 100 MB/8 = 12.5 MB

### Domanda 3
Esercizi risolti a lezione durante le esercitazioni, file `io-exercises.pdf`

### Domanda 4
Sia dato un sistema operativo OS161, di cui viene riportato il codice relativo alla funzione `as_define_region`
    #define PAGE_SIZE 4096 /* size of VM page */ 
    #define PAGE_FRAME 0xfffff000 /* mask for getting page number from addr */
    ...
    as_define_region(struct addrspace *as, vaddr_t vaddr, size_t sz, int readable, int writeable, int executable) {
    size_t npages;
    ...
    /* Align the region. First, the base... */
    sz += vaddr & ~(vaddr_t)PAGE_FRAME;
    vaddr &= PAGE_FRAME;
    /* ...and now the length. */
    sz = (sz + PAGE_SIZE - 1) & PAGE_FRAME;
    npages = sz / PAGE_SIZE;
    ...
    if (as->as_vbase1 == 0) {
        as->as_vbase1 = vaddr;
        as->as_npages1 = npages;
        return 0;
    }
    ...
}

#### Si spieghi brevemente che cosa svolgono le istruzioni riportate.
`as_define_region` assegna ad un address space gli intervalli di indirizzi logici per i due segmenti (codice, dati); le istruzioni riportate allineano i segmenti alle pagine: `vaddr` viene riportato all'inizio della pagina, azzerandone i bit meno significativi, mentre `sz` viene incrementato in modo da essere multiplo di pagina.

#### Perché si controlla il valore di as->as_vbase1 per decidere se assegnare o meno as->as_vbase1 e as->as_npages1?
Perchè `as_define_region` viene chiamata due volte, una per il segmento di codice (1) e un'altra per il segmento di dati (2); la scelta di assegnare `as->as_vbase1` e `as->as_npages1` o le varianti `2` dipende da scelte su base cronologica (si assegna il primo ancora nullo, partendo da `as->as_vbase1`).

#### Supponendo che vaddr contenga il valore 0x612480 e che sz contenga il valore 8200 (decimale), si dica quali saranno i valori di vaddr, sz e npages al termine delle istruzioni riportate. Supponendo inoltre che as->as_vbase1 contenga 0 e la successiva as_prepare_load ottenga per as->as_pbase1 il valore 0x52000, si dica a quale indirizzo fisico corrisponderà l’indirizzo logico 0x617500.
8200 = 8192 + 8 = 0x2008
PAGE_SIZE = 4096 = 0x1000

sz += vaddr & ~(vaddr_t)PAGE_FRAME
   => sz = (0x612480 &  ~(vaddr_t)0xfffff000) + 0x2008
         = (0x612480 & 0x000fff) + 0x2008
         = (0x0480) + 0x2008
         = 0x2488

vaddr &= PAGE_FRAME
    => vaddr = 0x612480 & 0xfffff000
             = 0x612000

sz = (sz + PAGE_SIZE - 1) & PAGE_FRAME
   = (0x2488 + 0xfff) & 0xfffff000
   = 0x3487 & 0xfffff000
   = 0x3000

npages = sz / PAGE_SIZE
       = 0x3000 / 0x1000
       = 3
 
Se as->as_vbase1 contiene 0 si sta assegnando il segmento di codice (1). Ad as->as_vbase1 verrà quindi assegnato vaddr = 0x612000, cui corrisponderà successivamente as->as_pbase1 = 0x52000. L’indirizzo (user!) proposto è fuori dal segmento 1 in quanto dista più di 3 pagine da 0x612000. Non è quindi possibile tradurlo coi dati a disposizione. Se si suppone che l’indirizzo sia nel segmento 2 (dati) e che tale segmento sia adiacente al primo, sia nello spazio logico che in quello fisico, allora l’indirizzo fisico sarà 0x57500.

#### Dato il seguente frammento di codice relativo alla funzione cv_signal (il codice potrebbe contenere errori), si spieghi brevemente il funzionamento della funzione.
cv_signal(struct cv *cv, struct lock *lock) {
    …
    lock_release(lock);
    spinlock_acquire(&cv->cv_lock);
    wchan_wakeone(cv->cv_wchan,&cv->cv_lock);
    lock_acquire(Lock);
    spinlock_release(&cv->cv_lock);
    …
}
La funzione serve a segnalare che la condizione a cui è associata la condition variable puntata da `cv` è vera, svegliando uno e uno solo dei thread in attesa sul verificarsi della condizione.

#### Si spieghi il ruolo del lock ricevuto come parametro dalle funzioni cv_wait e cv_signal.
Il lock è necessario per garantire la mutua esclusione sulla condizione logica associata alla condition variable, è passato alla `cv_wait` affinchè questa possa rilasciarlo durante l'attesa per poi restituirlo al risveglio, mentre non è necessario all'interno della `cv_signal`, che lo riceve solo per verificarne il possesso.

#### Correggere eventuali errori presentando, se necessario, l’ implementazione corretta (giustificandola).
L’errore principale di questa funzione è l’uso improprio del lock, che non va rilasciato e riacquisito. La cv_signal, che chiama wchan_wakeone, è operazione veloce, che non manda il thread in attesa: non ha senso rilasciare il lock per permettere al thread svegliato di acquisirlo subito (si farebbero più context switch). Il lock sarà rilasciato dal thread che chiama cv_signal (dopo l’uscita da questa). A questo punto il thread in cv_wait (svegliato) potrà acquisire il lock e andare avanti. 

cv_signal(struct cv *cv, struct lock *lock) { 
    … 
    KASSERT(lock_do_i_hold(lock));
    spinlock_acquire(&cv->cv_lock);
    wchan_wakeone(cv->cv_wchan,&cv->cv_lock);
    spinlock_release(&cv->cv_lock);
    …
}

## 25-06-2018

### Domanda 1
Esercizi risolti a lezione durante le esercitazioni, file `memory-management-exercises-3.pdf`

### Domanda 2
Sia dato un file system Unix, basato su inode aventi 13 puntatori (10 diretti, 1 indiretto singolo 1 doppio e 1 triplo). I puntatori hanno dimensione di 32 bit e i blocchi hanno dimensione 1KB. Si sa che il file system contiene N file con indice indiretto triplo, 10N con indice indiretto doppio e 100N altri (con indice indiretto singolo o diretto).

#### Sapendo che i file occupano complessivamente (i blocchi di indice sono esclusi dal computo) 256 GB, si calcoli (non essendo nota la dimensione di ogni file) il massimo numero di file che possono essere presenti nel file system.
Num indici: 1 KB/4 B = 256 indici

M1: 1 <= M1 <= (10 + 256) (dim media file con indice indiretto singolo o diretto)
M2: (10 + 256 +1) <= M2 <= (10 + 256 + 256^2) (dim media file con indice indiretto doppio)
M3: (10 + 256 + 256^2 + 1) <= M3 <= (10 + 256 + 256^2 + 256^3) (dim media file con indice indiretto triplo)
N * M3 + 10 * N * M2 + 100 * N * M1 = 256 GB/1 KB = 256 M blocchi

Massimo calcolato con dimensioni minime dei file:
(10 + 256 + 256^2 + 1) * N + 10 * (10 + 256 + 1) * N + 100 * N = 256 M
(3037 + 256^2) * N = 256 M => N = 3914.6 => N = 3914
Numero massimo di file: 100 * N + 10 * N + N = 434454

#### E’ possibile calcolare anche il numero minimo di file presenti?
Mimimo calcolato con dimensioni massime dei file:
100N * 266 + 10N * (266 + 2562) + N * (266 + 2562 + 2563) = 256 M 
10N * 2562 + N * (2562 + 2563) = 256M
10N + (1+256)N = 4K 
N = 4K/267 = 15,34 => N = 16 perchè scegliendo N = 15 non si raggiunge l'occupazione data
Numero minimo di file: 100 * N + 10 * N + N = 1776

#### Sia dato, in questo file system, un file “d.txt” contenente 100000 record di dimensione variabile compresi tra 50 e 500 Byte (estremi inclusi). Si rappresenti l’organizzazione del file, calcolando quanti blocchi di dato e di indice sono necessari e/o sufficienti per rappresentarlo
5 * 10^6 B <= |d.txt| <= 50 * 10^6 B

Blocchi dato:
    |d.txt|min = 5 * 10^6 B/1024 B = 4883
    |d.txt|max = 50 * 10^6 B/1024 B = 48829

Il file è organizzato tramite iNode fino a indirizzamento indiretto doppio (dimensione minima e massima sono comprese tra 267 e (267 + 256^2) )

E' necessario un blocco indice di indice singolo, un blocco doppio di primo livello.
Il numero di blocchi di secondo livello è compreso tra (4883 - 267)/256 = 19 e (48829 - 267)/256 = 190
=> il numero complessivo di blocchi indice è compreso tra 21 e 192

#### Quale è la frammentazione interna di “d.txt”? (qualora non sia possibile calcolarla in modo esatto, si calcolino i valori minimo e massimo.
La frammentazione interna del file non è calcolabile in modo preciso, dato che non se ne conoscono le dimensioni, ma si può dire che è compresa tra 0 B e 1023 B (1 blocco intero di 1 KB meno un singolo B).

### Domanda 3

#### Si descrivano brevemente vantaggi e svantaggi di una inverted page table (IPT), rispetto a una tabella delle pagine standard (eventualmente gerarchica).
Risposta [duplicata](#confrontata-con-una-tabella-della-pagine-standard-quali-sono-i-vantaggi-egli-svantaggi-di-una-ipt)

#### Sia dato un processo avente spazio di indirizzamento virtuale di 32 GB, dotato di 8GB di RAM, su una architettura a 64 bit (in cui si indirizza il Byte), con gestione della memoria paginata (pagine/frame da 1KB). Si vogliono confrontare una soluzione basata su tabella delle pagine standard (una tabella per ogni processo) e una basata su IPT. Si calcolino le dimensioni della tabella delle pagine (ad un solo livello) per il processo e della IPT. Si ipotizzi che il pid di un processo possa essere rappresentato su 16 bit. Si utilizzino 32 bit per gli indici di pagina e/o di frame. Si dica infine, utilizzando la IPT proposta (32 bit per un indice di pagina/frame), quale è la dimensione massima possibile per lo spazio di indirizzamento virtuale di un processo.
Risposta data a lezione durante le esercitazioni, file `memory-management-exercises-1.pdf`

### Domanda 4
Sia dato un sistema operativo OS161.

#### A
Esercizi risolti a lezione durante le esercitazioni, file `os161-theory-exercises-2.pdf`

#### Si vuol realizzare il supporto (parziale, in quanto non si gestisce il parametro flags) per la system call waitpid, di cui si fornisce il prototipo: `pid_t waitpid (pid_t pid, int *returncode, int flags);`. Si è già realizzata una funzione proc_wait, avente prototipo: `int proc_wait(proc_t *proc);` che dato il puntatore al descrittore di un processo, ne attende la fine (del processo) e ne ritorna lo stato di terminazione. Si realizzi una funzione `sys_waitpid`, che possa essere richiamata nella `syscall` mediante:
    case SYS_waitpid:
        retval = sys_waitpid(tf->tf_a0, (userptr_t)tf->tf_a1);
        break;

// FILE proc.c // Si assuma che il tipo proc_t sia equivalente a struct proc, la tabella dei processi contiene nella riga i il puntatore alla struct proc (proc_t) del processo con pid == i va opportunamente aggiornata alla creazione e distruzione di un processo; esiste una funzione, esportata da proc.c, che ritorna il puntatore a una struct proc a partire dal pid // (leggendo la tabella): proc_from_pid 

    #if TABELLA_DINAMICA // se si realizza una tabella dinamica 
        proc_t **tabellaProcessi; da allocare in fase di boot int nProc=0; // da incrementare opportunamente al boot o riallocazione 
    #else // oppure, con allocazione statica, basata sulla costante MAX_PROC, da definire 
        proc_t *tabellaProcessi[MAX_PROC]; 
        int nProc = MAX_PROC; 
    #endif 
    
    proc_t *proc_from_pid(pid_t pid) { 
        return tabellaProcessi[pid]; 
    } 
    
// File proc_syscalls.c (o equivalente)
// NOTA: si suppone che la discruzione del processo sia effettuata nella proc_wait 

    int sys_waitpid (pid_t pid, userptr_t returncodeP) { 
        proc_t *proc = proc_from_pid(pid); // passa da pid a puntatore 
        if (proc==NULL) return -1; // o altro codice per indicare errore 
        *returncodeP = proc_wait(proc); // aspetta e assegna il valore ritornato 
        return (int)pid; // oppure altro codice per indicare successo 
    }

## 07-07-2017

### Domanda 1
Si consideri la seguente sequenza di riferimenti in memoria nel caso di un programma di 1500 parole, in cui, per ogni accesso, si indica se si tratta di lettura (R) o scrittura (W): W 161, R 311, R 584, W 623, W 570, R 209, R 185, R 1190, R 615, W 946, R 1020, W 1234, R 658, R 1446, W 364.Si utilizzi un algoritmo di sostituzione pagine di tipo Enhanced Second-Chance, per il quale, al bit di riferimento (da inizializzare a 0 in corrispondenza al primo accesso a una nuova pagina dopo il relativo page fault), si unisce il bit di modifica (modify bit). Si assuma che una pagina venga sempre modificata in corrispondenza a una scrittura (write), che siano disponibili 3 frame e che l’algoritmo operi con il criterio seguente: dato il puntatore alla pagina corrente (secondo la strategia FIFO) si fa un primo giro, senza modificare il reference bit, sulle pagine per localizzare la vittima (l’ordine di priorità è (reference,modify): (0,0), (0,1), (1,0), (1,1)), si fa un secondo giro per raggiungere la vittima ed eventualmente azzerare i reference bit delle pagine “salvate”.

#### Si determini la stringa dei riferimenti a pagine, supponendo che la loro dimensione sia di 150 parole. Determinare quali e quanti page fault (accessi a pagine non presenti nel resident set) si verificheranno. Si richiede la visualizzazione (dopo ogni accesso) del resident set, indicando per ogni frame i bit di riferimento e modifica. Si numerino le pagine a partire da 0.
Riferimenti:
   W 161 = 0001 0110 0001 => 1
   R 311 = 0011 0001 0001 => 2
   R 584 = 0101 1000 0100 => 3
   W 623 = 0110 0010 0011 => 4
   W 570 = 0101 0111 0000 => 3
   R 209 = 0010 0000 1001 => 1
   R 185 = 0001 1000 0101 => 1
   R 1190 = 0001 0001 1001 0000 => 7
   R 615 = 0110 0001 0101 => 4
   W 946 = 1001 0100 0101 => 6
   R 1020 = 0001 0000 0010 0000 => 6
   W 1234 = 0001 0010 0011 0100 => 8
   R 658 = 0110 0101 1000 => 4
   R 1446 = 0001 0100 0100 0110 => 9
   W 364 = 0011 0110 0100 => 2

|      A       |        |        |        |        |        |        |        |        |        |        |        |        |        |        |        |
| :----------: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: |
| Riferimenti  |   1    |   2    |   3    |   4    |   3    |   1    |   1    |   7    |   4    |   6    |   6    |   8    |   4    |   9    |   2    |
|  Read/Write  |   W    |   R    |   R    |   W    |   W    |   R    |   R    |   R    |   R    |   W    |   R    |   W    |   R    |   R    |   W    |
| Resident Set | 1(0,1) | 1(0,1) | 1(0,1) | 1(0,1) | 1(0,1) | 1(1,1) | 1(1,1) | 1(0,1) | 1(0,1) | 1(0,1) | 1(0,1) | 1(0,1) | 4(0,0) | 9(0,0) | 2(0,1) |
|              |        | 2(0,0) | 2(0,0) | 4(0,1) | 4(0,1) | 4(0,1) | 4(0,1) | 7(0,0) | 4(0,0) | 6(0,1) | 6(1,1) | 6(1,1) | 6(1,1) | 6(0,1) | 6(0,1) |
|              |        |        | 3(0,0) | 3(0,0) | 3(1,1) | 3(1,1) | 3(1,1) | 3(0,1) | 3(0,1) | 3(0,1) | 3(0,1) | 8(0,1) | 8(0,1) | 8(0,1) | 8(0,1) |
|  Page Fault  |   X    |   X    |   X    |   X    |        |        |        |   X    |   X    |   X    |        |   X    |   X    |   X    |   X    |

### Domanda 2
Sia dato un file system Unix, basato su inode aventi 13 puntatori (10 diretti, 1 indiretto singolo 1 doppio e 1 triplo). I puntatori hanno dimensione di 32 bit e i blocchi hanno dimensione 1KB. Sia dato un file “d.dat” di dimensione 200 MB.

#### Si rappresenti l’organizzazione del file, calcolando quanti blocchi di dato e di indice sono necessari.
Blocchi dato: 200 MB/1 KB = 200 K blocchi

Indici per blocco: 1 KB/4 B = 256 indici

Indirizzamento diretto:
    10 blocchi dato
Indirizzamento singolo:
    256 blocchi dato
    1 blocco indice
Indirizzamento doppio:
    256^2 blocchi dato
    1 + 256 blocchi indice
Indirizzamento triplo:
    200 K - (10 + 256 + 256^2) = 138998 blocchi dato
    1 (primo livello) + 3 (secondo livello) + |138998/256| = 547 blocchi indice

Totale blocchi indice: 1 + 257 + 547 = 805

#### Quale è la frammentazione interna di “d.dat”?
Il file non ha frammentazione interna perchè la sua dimensione è un multiplo di quella del singolo blocco dati.

#### Si supponga che il file contenga 100000 record di lunghezza variabile (di dimensioni comprese tra 600 e 5000 Byte), e che si sia generato un file di indici “d.ind”, contenente, per ogni record di “d.dat”, un record a lunghezza fissa di 64 bit (32 per il cognome e 32 per il numero di record logico, cioè un puntatore, in “d.dat”). I record in “d.ind” sono ordinati per cognome. Quanti blocchi di dato e di indice sono necessari per “d.ind” e quale è la sua frammentazione interna?
|d.ind| = 100000 * 8 B = 800000 B = 

Blocchi dato: 800000 B/1 KB = 781.25 => 782 blocchi

Indirizzamento diretto:
    10 blocchi dato
Indirizzamento singolo:
    256 blocchi dato
    1 blocco indice
Indirizzamento doppio:
    782 - (10 + 256) = 514 blocchi dato
    1 + |514/256| = 1 + 3 = 4 blocchi indice

Frammentazione interna: 0.75 blocchi = 786 B

#### Supponendo di utilizzare per la ricerca di un cognome in “d.ind” un algoritmo binario (dicotomico), quanti blocchi di indice e di dato è necessario leggere per portare da disco a memoria i dati su una persona, nel caso peggiore?
Num. letture in d.ind = log2(100000) = 17

Si assume che per ogni accesso si rilegga il blocco su disco, anche se è lo stesso di accessi precedenti => 17 accessi totali a d.ind
Una volta trovato il cognome si accede direttamente a d.dat; nel caso peggiore un record occupa 5000 B, pari quindi a 5 blocchi (il caso peggiore è 6 blocchi se si considera che un record può iniziare a metà del blocco)

=> totale accessi caso peggiore: 17 + 6 = 23 accessi ai blocchi dato

Per ogni accesso a d.ind, nel caso peggiore, si leggono 2 blocchi indice (indirizzamento indiretto doppio), mentre per d.dat ne servono 3 (indirizzamento indiretto triplo)
=> totale accessi: 17 * 2 + 6 * 3 = 52 accessi ai blocchi indice

### Domanda 3
Esercizi risolti a lezione durante le esercitazioni, file `io-exercises.pdf`

### Domanda 4
Sia dato un sistema operativo OS161.

#### Come vengono definiti gli indirizzi logici user e kernel? Quali sono gli intervalli di valori ammessi per entrambi?
OS161 segue per lo spazio degli indirizzi logici (su 32 bit) lo schema MIPS. Non prevede una divisione netta in spazio utente e spazio kernel ma un unico spazio condiviso in cui gli indirizzi logici user e kernel hanno intervalli diversi: l'intervallo degli indirizzi user (kuseg0) occupa 2 GB e va dall'indirizzo 0x00000000 fino a 0x7FFFFFFF, l'intervallo riservato agli indirizzi kernel va invece da 0x80000000 fino a 0xFFFFFFFF. Gli indirizzi kernel sono poi divisi in kseg0 (da 0x80000000 fino a 0x9FFFFFFF, non mappato in TLB, utilizza la cache, occupa 0.5 GB), kseg1 (da 0xA0000000 fino a 0xBFFFFFFF, non mappato in TLB e non utilizza la cache, occupa 0.5 GB) e kseg2 (da 0xC0000000 fino a 0xFFFFFFFF, occupa 1 GB, inutilizzato). L'intervallo ammesso per indirizzi user è quindi da 0x00000000 fino a 0x7FFFFFFF, mentre gli indirizzi kernel validi vanno da 0x80000000 a 0xBFFFFFFF.

#### Sia dato un processo P, il cui addrspace (nella versione DUMBVM) viene visualizzato (mediante opportune kprintf) nel modo seguente. Quanta RAM è stata allocata al processo P?
AS segment 1) L: 0x400000 – P: 0x43000 – size: 2 pages
AS segment 2) L: 0x412000 – P: 0x47000 – size: 2 pages
AS stack ) L: 0x7ffee000 – P: 0x49000 – size: 12 pages
Page size: 4096 bytes
(L e P rappresentano, rispettivamente, indirizzi logici e fisici)

In totale sono state allocate 16 pagine da 4 KB, ovvero 64 KB di RAM.

#### Siano dati gli indirizzi fisici 0x440A0, 0x45200, 0x48100 e 0x51018. Si dica se appartengono o meno al processo P.
Segmento 1: 0x43000 - 0x44FFF
Segmento 2: 0x47000 - 0x48FFF
Stack : 0x49000 - 0x54FFF

0x440A0: appartiene al segmento 1
0x45200: non appartiene a P
0x48100: appartiene al segmento 2
0x51018: appartiene allo stack

#### Si dica poi, per ognuno dei 4 indirizzi (indipendentemente dal fatto che appartengano o meno a P), a quale indirizzo logico corrisponderebbero, se visti come indirizzi di kernel.
Il kernel esegue il mapping indirizzo logico -> fisico sommando al primo il valore 0x80000000 (costante MIPS_KSEG0)

0x440A0 -> 0x800440A0
0x45200 -> 0x80045200
0x48100 -> 0x80048100
0x51018 -> 0x80051018

#### Commentare il seguente frammento di codice relativo alla funzione cv_wait, spiegando il significato delle singole istruzioni. Correggere eventuali errori presentando, se necessario, l’ implementazione corretta (giustificandola).
    cv_wait(struct cv *cv, struct lock *lock) {
        …
        lockRelease(lock);
        SpinlockAcquire(&cv->cv_lock);
        wchanSleep(cv->cv_wchan,&cv->cv_lock);
        LockAcquire(Lock);
        Spinlock_Release(&cv->cv_lock);
        …
    }

La funzione cv_wait ha come obiettivo mettere un processo/thread in attesa sulla condition variable cv (attesa realizzata mediante wchanSleep su cv->cv_wchan, il wait channel contenuto dalla struct cv per gestire tale attesa), rilasciando contestualmente il lock prima dell'attesa e riottenendolo poi prima di ritornare.

Errori:
    LockAcquire non può essere chiamata dopo aver chiamato già SpinlockAcquire, in quanto la prima genera un'ulteriore chiamata alla SpinlockAcquire, sintassi non permessa in OS161; SpinlockRelease deve essere dunque chiamato prima di LockAcquire
    Il rilascio del lock, fatto senza spinlock già acquisito, non garantisce atomicità di wait e rilascio del lock, violando la semantica della condition variable; SpinlockAcquire va fatta prima della lockRelease.

Versione corretta
    cv_wait(struct cv *cv, struct lock *lock){
        SpinlockAcquire(&cv->cv_lock);
        lockRelease(lock);
        wchanSleep(cv->cv_wchan,&cv->cv_lock);
        Spinlock_Release(&cv->cv_lock);
        LockAcquire(Lock);
    }


## Extra

### Conversione esadecimale -> binario
Dato un numero esadecimale (es: 3F5), la corrispondente numerazione in binario è la sequenza dei tre numeri che lo compongono in binario (in questo caso 0011 1111 0101).
Un indirizzo logico è su 12 bit ed è composto da (page, displacement); displacement è dato dalla potenza di 2 corrispondente alla dimensione della pagina (128 bytes => 7 bit per displacement). La pagina è individuata da page (12 - displ), e si trova nei bit più significativi dell'indirizzo espresso in esadecimale: nell'esempio, con 0011 1111 0101 come riferimento in memoria e 128 byte di dimensione della pagina si ha p = 5, e dunque i primi 5 bit dell'indirizzo (00111) individuano il riferimento (una volta trovati i bit il riferimento va convertito in decimale).