#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "pthread.h"
#include "semaphore.h"
#include <errno.h>

long int n, step, active_threads, counter;
long int *x;
sem_t *me, *barrier1, *barrier2;

static void *sum_thread (void *);

int main(int argc, char **argv) {
  long int i, npower, status;
  pthread_t *th;

  if (argc < 2){
    fprintf (stderr, "Syntax: %s log2 of the number of elements of array x\n", argv[0]);
    exit(1);
  }
  
  setbuf (stdout, NULL);
  
  n = atol(argv[1]);
  npower = 1 << n;
  active_threads = npower -1;
  counter = 0;
  step = 1;
 
  x = (long int *) malloc(npower * sizeof(long int));
  th = (pthread_t *) malloc(npower * sizeof(pthread_t));
  
  me = (sem_t *) malloc(sizeof(sem_t));
  sem_init(me, 0, 1);
  barrier1 = (sem_t *) malloc(sizeof(sem_t));
  sem_init(barrier1, 0, 0);
  barrier2 = (sem_t *) malloc(sizeof(sem_t));
  sem_init(barrier2, 0, 0);

  fprintf (stdout, "Initial array: ");
  for (i=0;i<npower;i++) {
    x[i] = rand() % 10 +1;
    fprintf (stdout, "%2ld ", x[i]);
  }
  fprintf (stdout, "\n\n");
  
  for (i=1; i<npower; i++) {
    pthread_create(&th[i], NULL, sum_thread, (void *) i);
  }
  for (i=1; i<npower; i++) {
    sem_post(barrier1);
  }
  
  printf("  x[1] = %ld\n", x[i]);
  for (i=1; i<npower; i++){
    pthread_join (th[i], (void *) &status);
    printf ("  x[%ld] = %ld\n", i, status);
  }
  printf("\n");

  fprintf (stdout, "Cumulative sum: ");
  for (i=0; i<npower; i++) {
    fprintf (stdout, "%2ld ", x[i]);
  }
  fprintf (stdout, "\n");

  return (1);
}

static void *sum_thread (void *arg) {
  long int i = (long int) arg;
  long int j, gap, sum;

  while(1) {
    sem_wait(barrier1);
    if (step > n)
      break;
    gap = 1 << (step-1);
    if (i >=  gap )
      sum = x[i] + x[i-gap];

    sem_wait(me);
    printf ("    step %ld, i %ld, counter %ld, active = %ld\n",
      step, i, counter, active_threads);
    if (++counter == active_threads){
      for (j=0;j<active_threads;j++)
        sem_post(barrier2);
    }
    sem_post(me);
  
    sem_wait(barrier2);
    x[i] = sum;
    printf ("    step %ld, i %ld, active %ld, x[%ld]=sum = %ld\n",
      step, i, active_threads, i, sum);

    sem_wait(me);
    if (--counter == 0) {
      printf ("    last is %ld\n", i);
      if (i == step) {
        printf("    step %ld , thread %ld exiting as last, active %ld\n",
	  step, i, active_threads-1);   
        step++;
        --active_threads;
        for (j=0; j<active_threads; j++) {
          sem_post(barrier1);
	}
        sem_post(me);
        pthread_exit ((void *) sum);
       } else {
        step++;
        for (j=0; j<active_threads; j++)
          sem_post (barrier1);
       }
    } else {
      if (i == step) {
        --active_threads;
        sem_post(me);
        printf ("    step %ld, thread %ld exiting but it is not the last, active %ld\n",
	  step, i, active_threads);
        pthread_exit((void *) x[i]);
      }
    }
    sem_post(me);
  }
  printf ("    step %ld, thread %ld exiting\n", step, i);

  pthread_exit((void *) x[i]);
}


