# Guida Lab5

Bisogna aggiungere alla `struct proc` che definisce un processo un nuovo campo:
    struct openfile *fileTable[ OPEN_MAX]; //lista di tutti i file aperti da un dato processo, contiene informazioni (offset lettura, privilegi)

Si devono anche aggiungere i nuovi casi al costrutto `switch` di `kern/arch/mips/syscall/syscall.c` per gestire la chiamata alle nuove funzioni `open()` e `close()`.

All'interno di `kern/syscall/file_syscalls.c` bisogna inoltre definire una
    struct openfile {
        struct vnode *vn;
        off_t offset;
        unsigned int countRef;
    }

    struct openfile systemFileTable[SYSTEM_OPEN_MAX]; //lista di tutti i file aperti nel sistema, per ogni file aperto in ciascun processo si aggiunge una nuova entry, copiata poi nella struct analoga del processo

## Open e Close

    int sys_open(userptr_t path, int openflags, mode_t mode, int *errp) {
        int fd, i;
        struct vnode *v;
        struct openfile *of=NULL;; 	
        int result;

        result = vfs_open((char *)path, openflags, mode, &v);
        if (result) {
            *errp = ENOENT;
            return -1;
        }
        /* search system open file table */
        for (i=0; i < SYSTEM_OPEN_MAX; i++) {
            if (systemFileTable[i].vn==NULL) {
                of = &systemFileTable[i];
                of->vn = v;
                of->offset = 0; // TODO: handle offset with append
                of->countRef = 1;
                break;
            }
        }
        if (of==NULL) { 
            // no free slot in system open file table
            *errp = ENFILE;
        } else {
            for (fd=STDERR_FILENO+1; fd<OPEN_MAX; fd++) {
                if (curproc->fileTable[fd] == NULL) {
	                curproc->fileTable[fd] = of;
	                return fd;
                }
            }
            // no free slot in process open file table
            *errp = EMFILE;
        }
  
        vfs_close(v);
        return -1;
    }

    int sys_close(int fd) {
        struct openfile *of=NULL; 
        struct vnode *vn;

        if (fd<0||fd>OPEN_MAX) return -1;
        of = curproc->fileTable[fd];
        if (of==NULL) return -1;
        curproc->fileTable[fd] = NULL;

        if (--of->countRef > 0) return 0; // just decrement ref cnt
        vn = of->vn;
        of->vn = NULL;
        if (vn==NULL) return -1;

        vfs_close(vn);	
        return 0;
    }

## Read e Write
Le funzioni `sys_read` e `sys_write` vanno modificate, facendo sì che chiamino le funzioni riportate sotto nel caso in cui il file descriptor passato sia diverso da stdin/stdout/stderr

    static int file_read(int fd, userptr_t buf_ptr, size_t size) {
        struct iovec iov;
        struct uio ku;
        int result, nread;
        struct vnode *vn;
        struct openfile *of;
        void *kbuf;

        if (fd<0||fd>OPEN_MAX) return -1; //controllo sul descrittore del file
        of = curproc->fileTable[fd];
        if (of==NULL) return -1; //controllo sulla struct contenente informazioni sul file da leggere
        vn = of->vn;
        if (vn==NULL) return -1; //controllo sul vnode associato al file

        kbuf = kmalloc(size);
        uio_kinit(&iov, &ku, kbuf, size, of->offset, UIO_READ); //inizializzazione dei parametri necessari per poter eseguire VOP_READ
        result = VOP_READ(vn, &ku);
        if (result) {
            return result;
        }
        of->offset = ku.uio_offset;
        nread = size - ku.uio_resid;
        copyout(kbuf,buf_ptr,nread); //copia da memoria kernel a memoria user del buffer letto
        kfree(kbuf);
        return (nread);
    }

    static int file_write(int fd, userptr_t buf_ptr, size_t size) {
        struct iovec iov;
        struct uio ku;
        int result, nwrite;
        struct vnode *vn;
        struct openfile *of;
        void *kbuf;

        if (fd<0||fd>OPEN_MAX) return -1;
        of = curproc->fileTable[fd];
        if (of==NULL) return -1;
        vn = of->vn;
        if (vn==NULL) return -1;

        kbuf = kmalloc(size);
        copyin(buf_ptr,kbuf,size);
        uio_kinit(&iov, &ku, kbuf, size, of->offset, UIO_WRITE);
        result = VOP_WRITE(vn, &ku);
        if (result) {
            return result;
        }
        kfree(kbuf);
        of->offset = ku.uio_offset;
        nwrite = size - ku.uio_resid;
        return (nwrite);
}