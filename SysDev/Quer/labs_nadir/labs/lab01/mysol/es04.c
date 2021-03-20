#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(){
  int n = 3;
  int i;
  int *vet;
  pid_t pid;

  vet = malloc(n * sizeof(int));

  for(i = 0; i < n; i++){
    pid = fork();
    if(pid == 0){ //child
      vet[i] = 0;
    }
    else{ //parent
      vet[i] = 1;

      waitpid(pid, NULL, 0);
    }
  }

  for(i = 0; i < n; i++){
    printf("%d", vet[i]);
  }
  printf("\n");



  return 0;
}
