#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include "semaphore.h"

struct tS{
  int i;
  pthread_t *tids;
  int n;
  sem_t *sem;
};

void* t_func(void* args);

int main(int argc, char *argv[]){
  //int n = atoi(argv[1]);
  int n = 3;

  pthread_t tids[2];
  int i;
  struct tS *args;
  args = malloc(2 * sizeof(struct tS));

  sem_t *sem;
  sem = (sem_t *) malloc(sizeof(sem_t));
  sem_init(sem, 0, 1);

  for(i = 0; i < 2; i++){
    args[i].i = 1;
    args[i].tids = malloc(n * sizeof(pthread_t));
    args[i].tids[0] = pthread_self();
    args[i].n = n;
    args[i].sem = sem;

    pthread_create(&tids[i], NULL, t_func, (void *) &args[i]);
  }

  for(i = 0; i < 2; i++){
    pthread_join(tids[i], NULL);
  }

  return 0;
}

void* t_func(void* args){
  struct tS *t_data;
  t_data = (struct tS *) args;

  //printf("i: %d, n: %d\n", t_data->i, t_data->n);

  if(t_data->i == t_data->n){ //leaf
    int k;

    sem_wait(t_data->sem);

    for(k = 0; k < t_data->n; k++){
      printf("%ld ", t_data->tids[k]);
    }
    printf("\n");

    sem_post(t_data->sem);
  }
  else{
    //printf("i: %d, n: %d\n", t_data->i, t_data->n);
    pthread_t tids[2];
    int i, j;
    struct tS *args;
    args = malloc(2 * sizeof(struct tS));

    for(i = 0; i < 2; i++){
      args[i].i = t_data->i + 1;
      args[i].n = t_data->n;
      args[i].sem = t_data->sem;

      args[i].tids = malloc(t_data->n * sizeof(pthread_t));
      args[i].tids[t_data->i] = pthread_self();
      for(j = 0; j < t_data->i; j++){
        args[i].tids[j] = t_data->tids[j];
      }

      pthread_create(&tids[i], NULL, t_func, (void *) &args[i]);
    }

    for(i = 0; i < 2; i++){
      pthread_join(tids[i], NULL);
    }
  }
}
