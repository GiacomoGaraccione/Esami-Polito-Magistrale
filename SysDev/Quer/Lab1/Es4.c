#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void createBinary(int n, int pos, int processes);

int main(){
 int n = 3, processes = 1, i;
 for(i=1; i<=n; i++){
  processes = processes*2;
 }

 for(i=0; i<processes; i++){
  if(!fork()){
   createBinary(n, i, processes);
  }
 }
 for(i=0; i<processes; i++){
  wait(NULL);
 }
 return(0);
}

void createBinary(int n, int pos, int processes){
 int *vet = (int *) malloc(n*sizeof(int));
 int i, val = processes, res;
 for(i=0; i<n; i++){
  vet[i] = pos%2;
  pos = pos/2;
 }
 for(i=0; i<n; i++){
  printf("%d", vet[i]);
 }
 printf("\n");
 exit(0);
}
