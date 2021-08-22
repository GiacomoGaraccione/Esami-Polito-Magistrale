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

#### Why is systemFileTable a global variable, whereas fileTable is a field of struct proc ?
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