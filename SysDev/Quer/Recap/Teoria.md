# Domande Teoria

## Which of the following pieces of information are not stored inside the Process Control Block?

- Signal handlers

## Explain the effect of running the system call `exec` from a UNIX program
Running `exec` from an UNIX program substitutes the process that made the system call with the one specified in the `exec` command. The process code is changed with the one of the new process but the PID remains the same; after the code of the new process ends there's no return to the original code of the calling process.

### Explain what differentiates the `l`, `v`, `p` and `e` versions

- `l`: arguments passed to the system call are a list of strings
- `v`: arguments passed to the system call are an array/vector of string arguments
- `p`: the executable filename is looked for in the directories listed in the environmental variable `PATH`
- `e`: the environment vector `envp[]` defines a set of new association strings `name = value`

### Make an example of how the `v` and the `l` versions can be used

- `execlp("ls", "ls", "-l", (char *)NULL)` executes the command `ls -l`. The first parameter is the path name of the command to be executed, the following two are, in order, the equivalent of `argv[0]` and `argv[1]` for the command and the final parameter acts as terminator of the list of parameters.
- `execp("ls", argv)` with `argv` being defined as `char *argv[3]; argv[0] = "ls", argv[1] = "-l"; argv[2] = NULL;`, executes the command `ls -l`. The first parameter acts as the name of the command to be executed, the second is the array containing all parameters required for the new command.

### Why could the system call `exec` not return?

Because it substitutes the original process image with a new one, and it isn't expected to return to the original one.

## Which of the following statements are correct in relation to an `orphan` process?

- The process is inherited by the `init` process
- The process is waiting that its parent is performing a `wait` system call
- The process won't become a `zombie` process at its termination because it will be inherited by the `init` process

## Which of the following statements are correct in relation to a `zombie` process?

- The process is terminated
- The PCB of the process wil be deleted only after its father will perform a `wait` or `waitpid` system call

## Which of the following statements are correct in relation to signals in UNIX/Linux environment?

- The reception of some kinds of signals (`SIGKILL`, for example) can't be ignored
- The execution of a signal handler after the reception of a signal by a process can lead to race conditions
- Inside of a signal handler only reentrant functions should be used

## Which of the following statements are correct in relation to the system call `kill` and to the shell command `kill`?

- The shell command kills a process, the system call doesn't
- Both send a signal to a process