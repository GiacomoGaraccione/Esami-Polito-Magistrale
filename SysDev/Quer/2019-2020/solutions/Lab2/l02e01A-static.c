#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>
#include <time.h>

#define SIZE 5

int main(int argc, char *argv[]) {
    float v1T[SIZE] = {-0.0613,
                       -0.1184,
                       0.2655,
                       0.2952,
                       -0.3131};

    float mat[SIZE][SIZE] = {{-0.3424, -0.3581, 0.1557, 0.2577, 0.2060},
                             {0.4706, -0.0782, -0.4643, 0.2431, -0.4682},
                             {0.4572, 0.4157, 0.3491, 0.1078, -0.2231},
                             {-0.0146, 0.2922, 0.4340, -0.1555, -0.4029},
                             {0.3003, 0.4595, 0.1787, -0.3288, -0.4656}};

    float v2T[SIZE] = {-0.3235,
                       0.1948,
                       -0.1829,
                       0.4502,
                       -0.4656};

    float v[SIZE] = {0};

   for (int i=0; i<SIZE; i++) {
     for (int j=0; j<SIZE; j++) {
       fprintf (stdout, "%8.4f ", mat[i][j]);
     }
     fprintf (stdout, "\n");
   }

   for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            v[i] += v1T[j] * mat[j][i];
        }
	printf("%f ", v[i]);
    }
    printf("\n\n");

    float res = 0;

    for (int i = 0; i < SIZE; i++) {
        res += v[i] * v2T[i];
    }
    printf("Res: %f\n", res);

    return;
}
