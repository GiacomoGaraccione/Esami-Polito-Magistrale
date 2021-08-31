# Guida Lab2

## Aggiungere nuove System Calls

Il file `kern/arch/mips/syscall/syscall.c` contiene la funzione che si occupa di gestire l'identificazione della system call da chiamare in base ai valori del trapframe (`switch`); aggiungendo nuovi casi si possono dunque creare nuove system calls.

Una volta definita un'opzione adeguata che fornisce supporto alle nuove system calls è possibile modificare la funzione:

    void syscall(struct trapframe *tf)
    {
	    int callno;
	    int32_t retval;
	    int err;

	    KASSERT(curthread != NULL);
	    KASSERT(curthread->t_curspl == 0);
	    KASSERT(curthread->t_iplhigh_count == 0);

	    callno = tf->tf_v0;

	    /*
        * Initialize retval to 0. Many of the system calls don't really return a value, just 0 for success and -1 on error. Since retval is the value returned on success, initialize it to 0 by default; thus it's not necessary to deal with it except for calls that return other values, like write.
	    */

	    retval = 0;

	    switch (callno) {
	        case SYS_reboot:
		    err = sys_reboot(tf->tf_a0);
		    break;

	        case SYS___time:
		    err = sys___time((userptr_t)tf->tf_a0, (userptr_t)tf->tf_a1);
		    break;

	        /* Add stuff here */
        #if OPT_SYSCALLS //modifiche aggiunte per gestire le syscalls
	        case SYS_write:
	            retval = sys_write((int)tf->tf_a0, (userptr_t)tf->tf_a1, (size_t)tf->tf_a2); //i parametri dati a write() sono contenuti nei registri del trapframe nello stesso ordine in cui sono passati (descriptor = a0, buffer da scrivere = a1, dimensioni = a2)
		    /* error: function not implemented */
                if (retval<0) err = ENOSYS; 
		        else err = 0;
                break;

	        case SYS_read:
	            retval = sys_read((int)tf->tf_a0, (userptr_t)tf->tf_a1, (size_t)tf->tf_a2);
		        /* error: function not implemented */
                if (retval<0) err = ENOSYS; 
		        else err = 0;
                break;

	        case SYS__exit:
	            /* TODO: just avoid crash */
 	            sys__exit((int)tf->tf_a0);
                break;
        #endif

	        default:
		        kprintf("Unknown syscall %d\n", callno);
		        err = ENOSYS;
		        break;
	    }

	    if (err) {
            // Return the error code. This gets converted at userlevel to a return value of -1 and the error code in errno.
		    tf->tf_v0 = err;
		    tf->tf_a3 = 1;      /* signal an error */
	    } else {
		    /* Success. */
		    tf->tf_v0 = retval;
		    tf->tf_a3 = 0;      /* signal no error */
	    }

	    // Now, advance the program counter, to avoid restarting the syscall over and over again.

	    tf->tf_epc += 4;

	    /* Make sure the syscall code didn't forget to lower spl */
	    KASSERT(curthread->t_curspl == 0);
	    /* ...or leak any spinlocks */
	    KASSERT(curthread->t_iplhigh_count == 0);
    }

## Write/Read System Calls
Funzioni da creare da zero, offrono supporto base (solo stdin/stdout, leggono/scrivono un carattere per volta); possono essere inserite in un nuovo file dedicato (`kern/syscall/file_syscalls.c`).

    int sys_write(int fd, userptr_t buf_ptr, size_t size) //parametri analoghi alla syscall write in ambiente Unix
    {
        int i;
        char *p = (char *)buf_ptr;

        if (fd!=STDOUT_FILENO && fd!=STDERR_FILENO) { //controllo sul descrittore passato per scrivere, se diverso da stdout/stderr si ha errore
            kprintf("sys_write supported only to stdout\n");
            return -1;
        }

        for (i=0; i<(int)size; i++) { //scrittura dell'intero buffer, un carattere alla volta
            putch(p[i]);
        }

        return (int)size; //il valore di ritorno è il numero totale di caratteri scritti
    }

    int sys_read(int fd, userptr_t buf_ptr, size_t size) //stessa logica
    {
        int i;
        char *p = (char *)buf_ptr;

        if (fd!=STDIN_FILENO) {
            kprintf("sys_read supported only to stdin\n");
            return -1;
        }

        for (i=0; i<(int)size; i++) {
            p[i] = getch();
            if (p[i] < 0) 
                return i;
        }

        return (int)size;
    }

## Exit System Call
Versione semplificata di `exit()`, distrugge semplicemente l'address space del processo e ne causa la terminazione.

    void sys__exit(int status)
    {
        /* get address space of current process and destroy */
        struct addrspace *as = proc_getas();
        as_destroy(as);
        /* thread exits. proc data structure will be lost */
        thread_exit();

        panic("thread_exit returned (should not happen)\n");
        (void) status; // TODO: status handling
    }

## Gestione Memoria Virtuale
Il file che deve essere modificato è `kern/arch/mips/vm/dumbvm.c`, definendo una nuova opzione che si occuperà di gestire la memoria virtuale.

    static struct spinlock freemem_lock = SPINLOCK_INITIALIZER; //spinlock utilizzato per assicurare mutua esclusione durante la liberazione della memoria

    static unsigned char *freeRamFrames = NULL; //vettore contenente l'indicazione di quali frame sono liberi nel sistema
    static unsigned long *allocSize = NULL; //allocSize[i] = n significa che, in freeRamFrames, dalla posizione i inclusa i successivi n elementi sono occupati
    static int nRamFrames = 0; //numero totale di frame disponibili nella ram

    static int allocTableActive = 0;

    static int isTableActive () {
        int active;
        spinlock_acquire(&freemem_lock);
        active = allocTableActive;
        spinlock_release(&freemem_lock);
        return active;
    }

    //funzione che deve essere modificata, inizializza le variabili quando si inizia a lavorare con la memoria virtuale
    void vm_bootstrap(void)
    {
        int i;
        nRamFrames = ((int)ram_getsize())/PAGE_SIZE;  
        /* alloc freeRamFrame and allocSize */  
        freeRamFrames = kmalloc(sizeof(unsigned char)*nRamFrames);
        if (freeRamFrames==NULL) return;  
        allocSize = kmalloc(sizeof(unsigned long)*nRamFrames);
        if (allocSize==NULL) {    
            /* reset to disable this vm management */
            freeRamFrames = NULL; return;
        }
        for (i=0; i < nRamFrames; i++) {    
            freeRamFrames[i] = (unsigned char)0;
            allocSize[i] = 0;  
        }
        spinlock_acquire(&freemem_lock);
        allocTableActive = 1;
        spinlock_release(&freemem_lock);
    }

    //funzione da aggiungere, ritorna un indirizzo di pagine fisiche libere lungo npages
    static paddr_t getfreeppages(unsigned long npages) {
        paddr_t addr;	
        long i, first, found, np = (long)npages;

        if (!isTableActive()) return 0; 
        spinlock_acquire(&freemem_lock); //mutua esclusione, solo un processo per volta può ricevere memoria per evitare conflitti
        for (i=0,first=found=-1; i < nRamFrames; i++) {
            if (freeRamFrames[i]) {
                if (i==0 || !freeRamFrames[i-1]) 
                    first = i; /* set first free in an interval */   
                if (i-first+1 >= np) {
                    found = first;
                    break;
                }
            }
        }

        if (found>=0) {
            for (i=found; i<found+np; i++) {
                freeRamFrames[i] = (unsigned char)0;
            }
            allocSize[found] = np;
            addr = (paddr_t) found*PAGE_SIZE;
        } else {
            addr = 0;
        }

        spinlock_release(&freemem_lock);

        return addr;
    }

    //funzione da modificare, assegna al processo richiedente il numero di pagine fisiche disponibili
    static paddr_t getppages(unsigned long npages)
    {
        paddr_t addr;

        /* try freed pages first */
        addr = getfreeppages(npages);
        if (addr == 0) {
        /* call stealmem */
            spinlock_acquire(&stealmem_lock);
            addr = ram_stealmem(npages);
            spinlock_release(&stealmem_lock);
        }
        if (addr!=0 && isTableActive()) {
            spinlock_acquire(&freemem_lock);
            allocSize[addr/PAGE_SIZE] = npages;
            spinlock_release(&freemem_lock);
        } 

        return addr;
    }

    //funzione da aggiungere, libera le pagine occupate indicate da addr
    static int freeppages(paddr_t addr, unsigned long npages){
        long i, first, np=(long)npages;	

        if (!isTableActive()) return 0; 
        first = addr/PAGE_SIZE;
        KASSERT(allocSize!=NULL); //il vettore contenente informazioni sulle dimensioni non può essere nullo
        KASSERT(nRamFrames>first); //la prima pagina da liberare non può essere oltre il numero di pagine presenti in ram

        spinlock_acquire(&freemem_lock);
        for (i=first; i < first+np; i++) {
            freeRamFrames[i] = (unsigned char)1;
        }
        spinlock_release(&freemem_lock);

        return 1;
    }

    //funzione da modificare, libera pagine kernel ottenute tramite get_kpages
    void free_kpages(vaddr_t addr){
        if (isTableActive()) {
            paddr_t paddr = addr - MIPS_KSEG0; //ricava l'indirizzo fisico corrispondente all'indirizzo virtuale e poi libera le pagine occupate partendo da tale indirizzo
            long first = paddr/PAGE_SIZE;	
            KASSERT(allocSize!=NULL);
            KASSERT(nRamFrames>first);
            freeppages(paddr, allocSize[first]);	
        }
    }

    //funzione da modificare, libera l'address space occupato da un processo
    void as_destroy(struct addrspace *as){
        dumbvm_can_sleep();
        freeppages(as->as_pbase1, as->as_npages1);
        freeppages(as->as_pbase2, as->as_npages2);
        freeppages(as->as_stackpbase, DUMBVM_STACKPAGES);
        kfree(as);
    }