#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct str{
 int pos;
 int n;
 pthread_t *past;
}str_th;

static void *thread_func(void *arg);

int main(int argc, const char *argv[]){
 int i, n;
 pthread_t *th1, *th2;
 th1 = (pthread_t *) malloc(sizeof(pthread_t));
 th2 = (pthread_t *) malloc(sizeof(pthread_t));
 str_th *str1 = (str_th *) malloc(sizeof(str_th *));
 str_th *str2 = (str_th *) malloc(sizeof(str_th *));

 setbuf(stdout, 0);
 
 n = atoi(argv[1]);

 str1->n = n;
 str2->n = n;
 str1->past = pthread_self();
 str2->past = pthread_self();
 str1->pos = 1;
 str2->pos = 1;

 pthread_create(&th1, NULL, thread_func, (void *)str1);
 pthread_create(&th2, NULL, thread_func, (void *)str2);
 
 pthread_join(th1, NULL);
 pthread_join(th2, NULL);
  
 return 0;
}

static void *thread_func(void *arg){
 str_th *str = (str_th *) arg;
 int pos = str->pos;
 int n = str->n;
 pthread_t *past = str->past;
 if(pos+1 == n){
  int i;
  for(i=0; i<n; i++){
   fprintf(stdout, "%ld ", past[i]);
  }
  fprintf(stdout, "\n");
  pthread_exit(NULL);
 }else{
  str_th *str1 = (str_th *)malloc(sizeof(str_th*));
  str_th *str2 = (str_th *)malloc(sizeof(str_th*));
  int i;
  pos = pos + 1;
  pthread_t *th1, *th2;
  th1 = (pthread_t *)malloc(pos*sizeof(pthread_t*));
  th2 = (pthread_t *)malloc(pos*sizeof(pthread_t*));
  for(i=0; i<pos; i++){
   th1[i] = past[i];
   th2[i] = past[i];
  }
  th1[pos] = pthread_self();
  th2[pos] = pthread_self();

  pthread_create(&th1[pos], NULL, thread_func, (void *)str1);
  pthread_create(&th2[pos], NULL, thread_func, (void *)str2);
  
  pthread_join(th1[pos], NULL);
  pthread_join(th2[pos], NULL);

  pthread_exit(NULL);
 }
 return NULL;
}
