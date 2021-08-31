# Guida Lab 3

## Implementazione di Lock

Le primitive di sincronizzazione usate in OS161 sono localizzate in `kern/thread/synch.c/`, mentre le loro definizioni si trovano in `kern/include/synch.h`.

### Definizioni in synch.h
    #define USE_SEMAPHORE_FOR_LOCK 1 //distingue tra implementazione con semaforo o con wait channel

    struct lock {
        char *lk_name;
        //add what you need here

        #if USE_SEMAPHORE_FOR_LOCK
            struct semaphore *lk_sem;
        #else
            struct wchan *lk_wchan;
        #endif

        struct spinlock lk_lock;
        volatile struct thread *lk_owner;
    }

    struct cv {
        char *cv_name;
        //add what you need here

        struct wchan *cv_wchan;
        struct spinlock cv_lock;
    }
### Definizioni in synch.c

    struct lock * lock_create(const char *name){
        //add stuff here as needed
        #if USE_SEMAPHORE_FOR_LOCK
            lock->lk_sem = sem_create(lock->lk_name, 1); //alloca il semaforo usato per il lock
	        if (lock->lk_sem == NULL) {
        #else
	        lock->lk_wchan = wchan_create(lock->lk_name); //alloca il wait channel
	        if (lock->lk_wchan == NULL) {
        #endif //in entrambi i casi, se la creazione fallisce libera la memoria e ritorna NULL
		    kfree(lock->lk_name);
		    kfree(lock);
		    return NULL;
	        }
	        lock->lk_owner = NULL;
	        spinlock_init(&lock->lk_lock);
            return lock;
    }

    //lock_destroy libera la memoria in modo diverso in base a quale soluzione è scelta

    void lock_acquire(struct lock *lock) {
        KASSERT(lock != NULL);
	    KASSERT(!(lock_do_i_hold(lock)));
	    KASSERT(curthread->t_in_interrupt == false);

        #if USE_SEMAPHORE_FOR_LOCK
            P(lock->lk_sem); //in OS161 è obbligatorio chiamare P (wait su un semaforo) prima di chiamare spinlock_acquire, perchè è proibito rilasciare la CPU mentre si è in possesso di uno spinlock
            spinlock_acquire(&lock->lk_lock);
        #else
            spinlock_acquire(&lock->lk_lock);
            while(lock->lk_owner != NULL){
                wchan_sleep(lock->lk_wchan, &lock->lk_lock);
            }
        #endif
            KASSERT(lock->lk_owner == NULL);
	        lock->lk_owner = curthread; //il thread corrente si è appena svegliato ed è diventato attuale possessore del lock
	        spinlock_release(&lock->lk_lock); //ma non dello spinlock, che viene invece rilasciato
    }

    void lock_release(struct lock *lock) {
        KASSERT(lock != NULL);
	    KASSERT(lock_do_i_hold(lock));
	    spinlock_acquire(&lock->lk_lock);
	    lock->lk_owner = NULL;

        #if USE_SEMAPHORE_FOR_LOCK
            V(lock->lk_sem); //signal al semaforo usato per implementare il lock
        #else
	        wchan_wakeone(lock->lk_wchan, &lock->lk_lock); //sveglia uno dei thread in attesa sul wait channel
        #endif
	        spinlock_release(&lock->lk_lock);
    }

    bool lock_do_i_hold(struct lock *lock) {
        bool res;
        spinlock_acquire(&lock->lk_lock);
        res = lock->lk_owner == curthread;
        spinlock_release(&lock->lk_lock);
        return res;
    }

## Implementazione di Condition Variable
Definizioni presenti negli stessi file relativi ai lock.

### Definizioni in synch.h
    
    struct cv {
        char *cv_name;
        //add what you need here

        struct wchan *cv_wchan;
        struct spinlock cv_lock;
    }

### Definizioni in synch.c

    struct cv * cv_create(const char *name) {
        //add stuff here as needed
        cv->cv_wchan = wchan_create(cv->cv_name); //implementazione tramite wait channel, che usano una sintassi analoga alle condition variable
	    if (cv->cv_wchan == NULL) {
		    kfree(cv->cv_name);
		    kfree(cv);
		    return NULL;
	    }
	    spinlock_init(&cv->cv_lock);
    }

    //cv_destroy libera la memoria occupata dalla cv con kfree

    void cv_wait(struct cv *cv, struct lock *lock) {
        KASSERT(lock != NULL);
	    KASSERT(cv != NULL);
	    KASSERT(lock_do_i_hold(lock));
        spinlock_acquire(&cv->cv_lock);

        lock_release(lock);
        wchan_sleep(cv->cv_wchan, &cv->cv_lock);
        spinlock_release(cv->cv_lock); //spinlock da rilasciare prima di chiamare lock_acquire, per evitare un'eventuale attesa sul lock
        lock_acquire(lock);
    }

    void cv_signal(struct cv *cv, struct lock *lock) {
        KASSERT(lock != NULL);
	    KASSERT(cv != NULL);
	    KASSERT(lock_do_i_hold(lock));

        spinlock_acquire(&cv->cv_lock); //spinlock non è necessario, perchè non servono operazioni atomiche, ma viene comunque acquisito per essere usato da wchan_wakeone
        wchan_wakeone(cv->cv_wchan, &cv->cv_lock);
        spinlock_release(&cv->cv_lock);
    }

    void cv_broadcast(struct cv *cv, struct lock *lock) {
        KASSERT(lock != NULL);
	    KASSERT(cv != NULL);
	    KASSERT(lock_do_i_hold(lock));

        spinlock_acquire(&cv->cv_lock); 
        wchan_wakeall(cv->cv_wchan, &cv->cv_lock);
        spinlock_release(&cv->cv_lock);
    }
