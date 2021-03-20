#include <stdlib.h>
#include <stdio.h>
#include <time.h>

float my_rand(void);

int main(){
  srand(time(NULL));

  int n = 3;

  float *v1, *v2, **mat;
  int i, j;

  //------------ init vectors--------------------------

  v1 = malloc(n * sizeof(float));
  v2 = malloc(n * sizeof(float));

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

  //----------------------- computation ----------------------------------

  float *v; //intermediate result v = v1^T * matrix
  float tmp;

  v = malloc(n * sizeof(float));

  for(i = 0; i < n; i++){
    tmp = 0;
    for(j = 0; j < n; j++){
      tmp = tmp + v1[j] * mat[j][i];
    }

    v[i] = tmp;
  }

  printf("v:\n");
  for(i = 0; i < n; i++){
    printf("%f ", v[i]);
  }
  printf("\n");

  float res; //result of the whole computation
  res = 0;
  for(i = 0; i < n; i++){
    res = res + v[i] * v2[i];
  }

  printf("\nres:\n%f\n", res);

  return 0;
}

float my_rand(void){
  float r;

  r = rand() % 1000;
  r = r / 1000;
  r = r - 0.5;

  return r;
}
