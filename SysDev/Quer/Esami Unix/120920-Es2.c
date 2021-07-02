#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/shm.h>
#include <ctype.h>
#include <string.h>

#define SHM_SIZE 1024

int main(int argc, const char *argv[]){
 int p1[2], p2[2], n, i;
 key_t key;
 int memid;
 char *data;
 char text[100];

 key = ftok("exam", 65);
 memid = (key, SHM_SIZE, 0644 | IPC_CREAT);
 data = shmat(memid, NULL, 0);
 
 pipe(p1);
 pipe(p2);

 if(fork()){ //process P1
  close(p1[0]);
  close(p2[1]);
  while(1){
   fprintf(stdout, "Insert strings: (STOP = end insertions)\n");
   fscanf(stdin, "%s", text);
   if(strcmp(text, "STOP") !=0){
    strcpy(data, text);
   }else{
    write(p1, "GO", 2*sizeof(char));
    read(p2, text, 2*sizeof(char));
   }
  }
  
 }else{ //process P2
  close(p1[1]);
  close(p2[0]);
  while(1){
   read(p1, text, 2*sizeof(char));
   n = 0;
   while(n<SHM_SIZE){
    n+= 100;
    strncpy(text, data, n);
    for(i = 0; i<n; i++){
     if(isupper(text[i])){
      text[i] = tolower(text[i]);
     }
     else if(islower(text[i])){
      text[i] = toupper(text[i]);
     }
    }
    fprintf(stdout, "%s\n", text);
   }
   write(p2, "GO", 2*sizeof(char));
  }
 }
}
