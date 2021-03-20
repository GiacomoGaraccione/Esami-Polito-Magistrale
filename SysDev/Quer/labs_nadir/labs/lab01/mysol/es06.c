#include <stdlib.h>
#include <stdio.h>
#include <pthread.h>
#include "semaphore.h"

#define NUM_T 2
#define BUFFER_SIZE 16

struct tS{
  int i, *queue, *head, *tail;
  sem_t *sem_full, *sem_empty;
};

void* t_func(void* args);

int main(){
  pthread_t tids[NUM_T];
  struct tS t_args[NUM_T];
  int i, queue[BUFFER_SIZE], *head, *tail;

  head = malloc(sizeof(int));
  tail = malloc(sizeof(int));

  *head = 0;
  *tail = 0;

  sem_t *sem_full, *sem_empty;
  sem_full = (sem_t *) malloc(sizeof(sem_t));
  sem_empty = (sem_t *) malloc(sizeof(sem_t));
  sem_init(sem_full, 0, 0);
  sem_init(sem_empty, 0, BUFFER_SIZE);

  for(i = 0; i < NUM_T; i++){
    t_args[i].i = i;
    t_args[i].queue = queue;
    t_args[i].head = head;
    t_args[i].tail = tail;
    t_args[i].sem_full = sem_full;
    t_args[i].sem_empty = sem_empty;
    pthread_create(&tids[i], NULL, t_func, (void *) &t_args[i]);
  }

  for(i = 0; i < NUM_T; i++){
    pthread_join(tids[i], NULL);
  }

  return 0;
}

void* t_func(void* args){
  struct tS *t_data;
  t_data = (struct tS *) args;

  if(t_data->i == 0){ //producer
    int i;
    for(i = 0; i < 1000; i++){
      sem_wait(t_data->sem_empty);

      t_data->queue[*t_data->tail] = i;
      *t_data->tail = (*t_data->tail + 1) % BUFFER_SIZE;

      sem_post(t_data->sem_full);
    }

    //finally enqueue -1 to terminate
    sem_wait(t_data->sem_empty);

    t_data->queue[*t_data->tail] = -1;
    *t_data->tail = (*t_data->tail + 1) % BUFFER_SIZE;

    sem_post(t_data->sem_full);
  }
  else{ //consumer
    int val;
    while(1){
      sem_wait(t_data->sem_full);

      val = t_data->queue[*t_data->head];
      *t_data->head = (*t_data->head + 1) % BUFFER_SIZE;

      sem_post(t_data->sem_empty);

      printf("%d\n", val);
      if(val == -1){
        pthread_exit( NULL );
      }
    }
  }
}
