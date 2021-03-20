#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <pthread.h>

int my_rand(void);
int my_pow(int base, int exp);

struct tS{
  int i, n, *v;
  pthread_mutex_t *mutex;
  pthread_barrier_t *bar, *bars2;
};

void* t_func(void* args);

int main(){
  srand(time(NULL));

  int n = 4;

  // ------------------------ init v ------------------------------------

  int i, *v;

  v = malloc( my_pow(2, n) * sizeof(int) );

  printf("v:\n");
  for(i = 0; i < my_pow(2, n); i++){
    v[i] = my_rand();
    printf("%d ", v[i]);
  }
  printf("\n");

  //------------------------ start threads --------------------------------------

  pthread_mutex_t *mutex;
  mutex = malloc(sizeof(pthread_mutex_t));
  pthread_mutex_init(mutex, NULL);

  pthread_barrier_t *bar;
  bar = malloc(n * sizeof(pthread_barrier_t));
  for(i = 0; i < n; i++){
      pthread_barrier_init(&bar[i], NULL, (my_pow(2, n) - 1) - ((my_pow(2, i) - 1)));
  }

  pthread_barrier_t *bars2;
  bars2 = malloc(n * sizeof(pthread_barrier_t));
  for(i = 0; i < n; i++){
      pthread_barrier_init(&bars2[i], NULL, (my_pow(2, n) - 1) - ((my_pow(2, i) - 1)));
  }

  pthread_t *tids;
  struct tS *t_args;

  tids = malloc( (my_pow(2, n) - 1) * sizeof(pthread_t) );
  t_args = malloc( (my_pow(2, n) - 1) * sizeof(struct tS) );

  for(i = 0; i < (my_pow(2, n) - 1); i++){
    t_args[i].i = i+1;
    t_args[i].n = n;
    t_args[i].v = v;
    t_args[i].mutex = mutex;
    t_args[i].bar = bar;
    t_args[i].bars2 = bars2;
    pthread_create(&tids[i], NULL, t_func, (void *) &t_args[i]);
  }

  for(i = 0; i < (my_pow(2, n) - 1); i++){
    pthread_join(tids[i], NULL);
  }

  printf("v after:\n");
  for(i = 0; i < my_pow(2, n); i++){
    printf("%d ", v[i]);
  }
  printf("\n");

  pthread_mutex_destroy(mutex);
  free(mutex);

  pthread_barrier_destroy(bar);
  free(bar);

  pthread_barrier_destroy(bars2);
  free(bars2);

  return 0;
}

void* t_func(void* args){
  struct tS *t_data;
  t_data = (struct tS *) args;

  int step, i;

  //printf("i am thread %d\n", t_data->i); //thread numeration starts from 1 and ends with n-1

  int my_element;
  int element_to_add, gap;

  for(step = 1; step <= t_data->n; step++){ //one for each step
    //--------------------------- gathering data -----------------------------------------
    my_element = t_data->v[t_data->i];
    gap = my_pow(2, step-1);
    if(t_data->i - gap < 0){
      printf("i should kill myself\n");
      return NULL;
    }
    element_to_add = t_data->v[t_data->i - gap];
    if(t_data->i == 3){
      //printf("step %d - v[%d] = %d + %d\n", step, t_data->i, my_element, element_to_add);
    }
    //printf("gathered data\n");

    //-------------------------- modifying vector -------------------------------------

    pthread_barrier_wait(&t_data->bar[step-1]);

    //the following has to be executed only after every thread executed the previous two lines.
    t_data->v[t_data->i] = my_element + element_to_add;

    //printf("modified vector\n");

    pthread_barrier_wait(&t_data->bars2[step-1]);

    /*if(t_data->i == 1){
      printf("v after step %d:\n", step);
      for(i = 0; i < my_pow(2, t_data->n); i++){
        printf("%d ", t_data->v[i]);
      }
      printf("\n");
    }*/

  }

  pthread_exit( NULL );  //return value
}

int my_pow(int base, int exp){
  int i;
  int res = 1;
  for(i = 0; i < exp; i++){
    res = res * base;
  }

  return res;
}

int my_rand(void){
  int r;

  r = rand() % 9 + 1;

  return r;
}
