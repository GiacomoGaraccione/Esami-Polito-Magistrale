#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <pthread.h>

float my_rand(void);
void* t_func(void* args);

struct tS{
  int i, n, *count_threads;
  float *v1, **mat, *v, *v2;
  pthread_mutex_t *mx;
};

int main(){
  srand(time(NULL));

  int n = 3;

  float *v1, *v2, **mat, *v;
  int i, j, *count_threads;

  count_threads = malloc(sizeof(int));
  *count_threads = 0;

  pthread_mutex_t *mx;
  mx = malloc(sizeof(pthread_mutex_t));
  pthread_mutex_init(mx, NULL);

  //------------ init vectors--------------------------

  v1 = malloc(n * sizeof(float));
  v2 = malloc(n * sizeof(float));
  v = malloc(n * sizeof(float));

  for(i = 0; i < n; i++){
    v1[i] = my_rand();
    v2[i] = my_rand();
  }

  printf("v1:\n");
  for(i = 0; i < n; i++){
    printf("%f ", v1[i]);
  }
  printf("\n");

  printf("v2:\n");
  for(i = 0; i < n; i++){
    printf("%f ", v2[i]);
  }
  printf("\n");

  //------------------ init matrix ------------------------------

  mat = malloc(n * sizeof(float *));

  for(i = 0; i < n; i++){
    mat[i] = malloc(n * sizeof(float));
  }

  printf("mat:\n");

  for(i = 0; i < n; i++){
    for(j = 0; j < n; j++){
      mat[i][j] = my_rand();
      printf("%f ", mat[i][j]);
    }
    printf("\n");
  }

  //----------------------- running threads ----------------------------------

  pthread_t *tids;
  struct tS *t_args;

  tids = malloc(n * sizeof(pthread_t));
  t_args = malloc(n * sizeof(struct tS));

  for(i = 0; i < n; i++){
    t_args[i].i = i;
    t_args[i].v1 = v1;
    t_args[i].v2 = v2;
    t_args[i].mat = mat;
    t_args[i].v = v;
    t_args[i].n = n;
    t_args[i].count_threads = count_threads;
    t_args[i].mx = mx;
    pthread_create(&tids[i], NULL, t_func, (void *) &t_args[i]);
  }



  for(i = 0; i < n; i++){
    pthread_join(tids[i], NULL);
  }

  pthread_mutex_destroy(mx);
  free(mx);

  return 0;
}

float my_rand(void){
  float r;

  r = rand() % 1000;
  r = r / 1000;
  r = r - 0.5;

  return r;
}

void* t_func(void* args){
  struct tS *t_data;
  t_data = (struct tS *) args;

  int i;
  float res = 0;
  for(i = 0; i < t_data->n; i++){
    res = res + t_data->v1[i] * t_data->mat[i][t_data->i];
  }

  t_data->v[t_data->i] = res;

  pthread_mutex_lock(t_data->mx);

  *t_data->count_threads = *t_data->count_threads + 1;

  if(*t_data->count_threads == t_data->n){ //it is the last thread to terminate
    res = 0;
    for(i = 0; i < t_data->n; i++){
      res = res + t_data->v[i] * t_data->v2[i];
    }

    printf("\nres:\n%f\n", res);
  }

  pthread_mutex_unlock(t_data->mx);

  pthread_exit( NULL );  //return value
}
