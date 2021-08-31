# Guida Lab4

Bisogna aggiungere alla `struct proc` che definisce un processo dei nuovi campi: 
    pid_t pid; //pid del processo
    int p_status; //status di terminazione ottenuto con exit()
    struct semaphore *p_sem; //semaforo utilizzato per sincronizzare l'attesa della terminazione di un processo (lock e cv possono essere usati come alternativa)

Deve anche essere aggiunto un nuovo caso all'interno del costrutto `switch` di `kern/arch/mips/syscall/syscall.c` per gestire la chiamata alla system call waitpid().


## Aspettare la terminazione di un Processo

Aggiungere una nuova funzione in `kern/proc/proc.c` che aspetti un segnale dal processo terminato tramite il meccanismo di sincronizzazione scelto:
    int proc_wait(struct proc * proc) {
        int return_status;
        /* NULL and kernel proc forbidden */
	    KASSERT(proc != NULL);
	    KASSERT(proc != kproc);
        P(proc->p_sem);
        return_status = proc->p_status;
        proc_destroy(proc); //il processo che ha terminato può essere distrutto solo dopo che il suo stato di terminazione è stato correttamente ricevuto dal processo che aspettava
        return return_status;
    }

Di conseguenza, `sys__exit` in `kern/syscall/proc_syscalls.c` deve essere modificato per non distruggere più il processo direttamente ma per segnalare la corretta terminazione:
    void sys__exit(int status) {
        struct proc *p = curproc;
        p->p_status = status & 0xff; /* just lower 8 bits returned */
        proc_remthread(curthread);
        V(proc->p_sem);
        thread_exit();
        panic("thread_exit returned (should not happen)\n");
    }