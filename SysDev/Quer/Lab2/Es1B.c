#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>

float generateRandom(float min, float max);
static void *threadFunc(void *arg);

float *v1, **mat, *vett, *v2;
int *done;
int n;
pthread_mutex_t *mutex;

int main(int argc, const char *argv[]) {
 int i, j;
 float res = 0;
 pthread_t *th;
 
 n = atoi(argv[1]);
 v1 = (float *)malloc(n*sizeof(float));
 v2 = (float *)malloc(n*sizeof(float));
 mat = (float **)malloc(n*n*sizeof(float));
 vett = (float *)malloc(n*sizeof(float));
 th = (pthread_t *)malloc(n*sizeof(pthread_t));
 done = (int *)malloc(n*sizeof(int));
 mutex = (pthread_mutex_t *)malloc(sizeof(pthread_mutex_t));

 pthread_mutex_init(mutex, NULL);
 
 for(i=0; i<n; i++){
  mat[i] = (float *)malloc(n*sizeof(float));
 }

 srand((unsigned int)time(NULL));
 
 for(i=0; i<n; i++){
  v1[i] = generateRandom(-0.5, 0.5);
  v2[i] = generateRandom(-0.5, 0.5);
  vett[i] = 0.0;
  done[i] = 0;
  for(j=0; j<n; j++){
   mat[i][j] = generateRandom(-0.5, 0.5);
  }
 }
 
 /* Sequential Solution*/
 for(i=0; i<n; i++){
  res = 0;
  for(j=0; j<n; j++){
   res = res + v1[i]*mat[i][j];
  }
  vett[i] = res;
 }
 
 res = 0;
 for(i=0; i<n; i++){
  res = res + vett[i]*v2[i];
 }
 printf("Sequential: %f\n", res);

 /* Concurrent Solution*/
 for(i=0; i<n; i++){
  pthread_create(&(th[i]), NULL, threadFunc, (void *)i);
 }
 
 for(i=0; i<n; i++){
  pthread_join(th[i], NULL);
 }

 pthread_mutex_destroy(mutex);
}

float generateRandom(float min, float max){
 return (max - min) * ((((float) rand()) / (float) RAND_MAX)) + min;
}

static void *threadFunc(void *arg){
 int i = (int) arg;
 int j, k, last = 1;
 float res = 0;
 
 for(j=0; j<n; j++){
  res = res + v1[i]*mat[i][j];
 }
 
 vett[i] = res;
 pthread_mutex_lock(mutex);
 done[i] = 1;
 pthread_mutex_unlock(mutex);
 for(j=0; j<n; j++){
  if(done[j] == 0){
   last = 0;
   break;
  }
 }
 
 if(last == 0){
  return(NULL);
 }else{
  res = 0;
  for(i=0; i<n; i++){
   res = res + vett[i]*v2[i];
  }
  printf("Concurrent: %f\n", res);
  return(NULL);
 }
 
}
