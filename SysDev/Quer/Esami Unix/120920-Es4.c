#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>
#include <time.h>

#define N 10
#define M 6

sem_t full, empty, mutCons;

int Q[M];
int threadsRunning = N, tail = 0, head = 0;

void *consumer(void *arg);
void enqueue(int val);
void dequeue(int *val);

int main(int argc, const char *argv[]){
 srand((unsigned)time(0));
 int i, val;
 pthread_t tids[N];

 sem_init(&(full), 0, 0);
 sem_init(&(empty), 0, M);
 sem_init(&(mutCons), 0, 1);

 for(i=0; i<N; i++){
  pthread_create(&tids[i], NULL, consumer, (void *) &i);
 }

 while(threadsRunning > 0){
  val = rand()  % 5;
  sem_wait(&empty);
  enqueue(val);
  sem_post(&full);
 }
}

void *consumer(void *arg){
 pthread_detach(pthread_self());
 int canGo = 1, val;
 while(canGo){
  sem_wait(&full);
  sem_wait(&mutCons);
  dequeue(&val);
  sem_post(&mutCons);
  sem_post(&full);
  if(val != 0){
   fprintf(stdout, "Consuming task: %d\n", val);
  }
  else{
   fprintf(stdout, "Thread ended\n");
   canGo = 0;
   threadsRunning--;
  }
 }
}

void enqueue(int val){
 Q[tail] = val;
 tail = (tail + 1) % M;
 return;
}

void dequeue(int *val){
 *val = Q[head];
 head = (head + 1) % M;
 return;
}
