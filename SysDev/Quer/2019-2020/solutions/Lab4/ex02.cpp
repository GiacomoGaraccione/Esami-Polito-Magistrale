/*
 *  StQ 10.05.2015
 *  StQ 25.05.2017
 *  StQ 01.06.2018
 */

#define UNICODE
#define _UNICODE

#define _CRT_DEFINE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <process.h>
#include <stdio.h>

// Debug Printing (y/n)
#define DEBUG    1
// Debug: Waiting Time (dt milliseconds)
#define dt    1000

typedef struct threads {
  INT id;
  LPTSTR fileName;
  INT *vet;
  INT vetN;
} threads_t;

INT WINAPI threadFunction(LPVOID);
static void sort(INT *, INT);
static void merge(threads_t **, INT, INT **, INT *, INT **, INT *);

INT _tmain(INT argc, LPTSTR argv[])
{
  INT i, fileN, n, index;
  INT *mergeOld, *mergeNew, mergeOldN, mergeNewN;
  DWORD *threadId, threadIndex, nOut;
  //DWORD exitCode;
  HANDLE *threadHandle, fileHandle;
  threads_t **threadData;

  fileN = argc - 2;
  threadData = (threads_t **)malloc(fileN * sizeof(threads_t *));
  threadHandle = (HANDLE *)malloc(fileN * sizeof(HANDLE));
  threadId = (DWORD *)malloc(fileN * sizeof(DWORD));
  if (threadData == NULL || threadHandle == NULL || threadId == NULL) {
    _tprintf(_T("Memory allocation error.\n"));
    ExitProcess(0);
  }

  // Run Thread
  for (i = 0; i < fileN; i++) {
    threadData[i] = (threads_t *)malloc(1 * sizeof(threads_t));
    if (threadData[i] == NULL) {
      _tprintf(_T("Memory allocation error.\n"));
      ExitProcess(0);
    }

    threadData[i]->id = i + 1;
    threadData[i]->fileName = argv[i + 1];
    threadHandle[i] = CreateThread(NULL, 0,
      (LPTHREAD_START_ROUTINE)threadFunction, threadData[i],
      0, &threadId[i]);
    if (threadHandle[i] == NULL) {
      ExitProcess(0);
    }
  }

  // Wait for all threads to complete (one for each iteration)
  mergeNew = NULL;
  mergeNewN = 0;
  i = fileN;
  while (i>0) {
    threadIndex = WaitForMultipleObjects(i, threadHandle, FALSE, INFINITE);
    index = (int) threadIndex - (int) WAIT_OBJECT_0;
#if 1
    _tprintf(_T("Thread %d Terminated.\n"), threadData[index]->id);
#endif
    //GetExitCodeThread(threadHandle[index], &exitCode);
    CloseHandle(threadHandle[index]);

    // Switch Old and New Array and Size
    mergeOld = mergeNew;
    mergeOldN = mergeNewN;
    merge(threadData, index, &mergeOld, &mergeOldN, &mergeNew, &mergeNewN);

    // Move thread data-set in the right place (throught pointers)
    // Remove Thread from Pending List of Threads
    threadHandle[index] = threadHandle[i - 1];
    free(threadData[index]->vet);
    threadData[index] = threadData[i-1];
    i--;
  }

  fileHandle = CreateFile(argv[argc - 1], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (fileHandle == INVALID_HANDLE_VALUE) {
    _tprintf(_T("Cannot open output file. Error: %x\n"),
      GetLastError());
    return 3;
  }

  /* Generate output */
#if DEBUG
  _tprintf(_T("File=%s #val=%d: "), argv[argc - 1], mergeNewN);
#endif
  WriteFile(fileHandle, &mergeNewN, sizeof(INT), &nOut, NULL);
  for (i = 0; i<mergeNewN; i++) {
#if DEBUG
    _tprintf(_T("%d "), mergeNew[i]);
#endif
    WriteFile(fileHandle, &mergeNew[i], sizeof(INT), &nOut, NULL);
  }
  _tprintf(_T("\n"));

  CloseHandle(fileHandle);

  free(threadData);
  free(threadHandle);
  free(threadId);
  free(mergeNew);

  _tprintf(_T("End Now: "));
  _tscanf_s(_T("%d"), &n);

  return 0;
}

INT WINAPI threadFunction(LPVOID lpParam) {
  threads_t *data;
  HANDLE fileHandle;
  INT n, val;
  DWORD nByte;

  data = (threads_t *)lpParam;

  fileHandle = CreateFile(data->fileName, GENERIC_READ,
    FILE_SHARE_READ, NULL, OPEN_EXISTING,
    FILE_ATTRIBUTE_NORMAL, NULL);
  if (fileHandle == INVALID_HANDLE_VALUE) {
    _tprintf(_T("Open file error: %x\n"), GetLastError());
    return (1);
  }

  if (ReadFile(fileHandle, &val, sizeof(INT), &nByte, NULL) && nByte > 0) {
    data->vetN = val;
    data->vet = (INT *)malloc(data->vetN * sizeof(INT));
    if (data->vet == NULL) {
      _tprintf(_T("Allocaton error.\n"));
      exit(1);
    }
  }

  n = 0;
  while (ReadFile(fileHandle, &val, sizeof(INT), &nByte, NULL)
    && n<data->vetN && nByte> 0) {
#if DEBUG
    _tprintf(_T("File=%s vet[%d]=%d\n"), data->fileName, n, val);
#endif
    data->vet[n] = val;
    n++;
  }

#if 1
  {
    float wtr;
    DWORD wti, maxT = 10;
    srand(data->vet[0]);
    wtr = maxT * 100 * ((float)(rand())) / ((float)(RAND_MAX));
    wti = (DWORD)(wtr * 1000);
    _tprintf(_T("Thread %d Wait for %d milliseconds.\n"), data->id, wti);
    Sleep(wti);
  }
#endif

  sort(data->vet, data->vetN);
  CloseHandle(fileHandle);

  ExitThread(0);
}

static void sort(INT *vet, INT n)
{
  INT i, j, tmp;

  for (i = 1; i < n; i++) {
    tmp = vet[i];
    j = i - 1;
    while (j >= 0 && tmp<vet[j]) {
      vet[j + 1] = vet[j];
      j--;
    }
    vet[j + 1] = tmp;
  }
  return;
}

static void merge(
  threads_t **threadData,
  INT index,
  INT **mergeOld,
  INT *mergeOldN,
  INT **mergeNew,
  INT *mergeNewN
  )
{
  INT i1, i2, i3;
  INT *vet, n;

  n = (*mergeOldN) + threadData[index]->vetN;
  vet = (INT *)malloc(n * sizeof(INT));
  if (vet == NULL) {
    _tprintf(_T("Allocaton error.\n"));
    exit(1);
  }

  i1 = i2 = i3 = 0;
  while (i1<(*mergeOldN) && i2<threadData[index]->vetN) {
    if ((*mergeOld)[i1] < threadData[index]->vet[i2]) {
      vet[i3++] = (*mergeOld)[i1++];
    }
    else {
      vet[i3++] = threadData[index]->vet[i2++];
    }
  }


  /* deal with v1 tail */
  while (i1 < (*mergeOldN)) {
    vet[i3++] = (*mergeOld)[i1++];
  }

  /* deal with v2 tail */
  while (i2 < threadData[index]->vetN) {
    vet[i3++] = threadData[index]->vet[i2++];
  }

  free(*mergeOld);
  *mergeOldN = 0;
  *mergeOld = NULL;
  *mergeNewN = n;
  *mergeNew = vet;

  return;
}

int findMin(
  threads_t *threadData,
  INT *indices,
  INT n
  )
{
  INT i, min, minIndex;

  minIndex = (-1);
  for (i = 0; i < n; i++) {
    if (indices[i] < threadData[i].vetN) {
      if (minIndex == (-1) || threadData[i].vet[indices[i]]<min) {
        minIndex = i;
        min = threadData[i].vet[indices[i]];
      }
    }
  }
  return minIndex;
}
