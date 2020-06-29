/*
 *  StQ 10.05.2015
 *  StQ 10.05.2017
 *  Merge N ordered files
 *  Use _beginthreadex
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
  LPTSTR fileName;
  INT *vet;
  INT vetN;
} threads_t;

unsigned WINAPI threadFunction(LPVOID);
static void sort (INT *, INT);
static void merge(threads_t *threadData, INT, INT **, INT *);
static int findMin(threads_t *, INT *, INT);

INT _tmain(
  INT argc, 
  LPTSTR argv[]
  )
{
  INT i, j, fileN, n, *vetAll, vetAllN;
  unsigned *threadId;
  DWORD nOut;
  HANDLE *threadHandle, fileHandle;
  threads_t *threadData;

  fileN = argc - 2;
  threadData = (threads_t *)malloc(fileN * sizeof(threads_t));
  threadHandle = (HANDLE *)malloc(fileN * sizeof(HANDLE));
  threadId = (unsigned *)malloc(fileN * sizeof(unsigned));

  // Run Thread
  for (i=0; i<fileN; i++) {
    threadData[i].fileName = argv[i+1];
    threadHandle[i] = (HANDLE) _beginthreadex (NULL, 0, threadFunction,
      &threadData[i], 0, &threadId[i]);
    /*    threadHandle[i] = CreateThread(NULL, 0,
      (LPTHREAD_START_ROUTINE)threadFunction, &threadData[i],
      0, &threadId[i]);*/
    if (threadHandle[i] == NULL) {
      ExitProcess(0);
    }
  }

  // Wait until all threads have terminated.
  WaitForMultipleObjects(fileN, threadHandle, TRUE, INFINITE);
  for (i=0; i<fileN; i++) {
    CloseHandle(threadHandle[i]);
  }

#if DEBUG
  for (i = 0; i < fileN; i++) {
    _tprintf(_T("File=%s #val=%d: "), threadData[i].fileName,
      threadData[i].vetN);
    for (j = 0; j < threadData[i].vetN; j++) {
      _tprintf(_T("%d "), threadData[i].vet[j]);
    }
    _tprintf(_T("\n"));
  }
#endif

  merge(threadData, fileN, &vetAll, &vetAllN);

  fileHandle = CreateFile(argv[argc-1], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (fileHandle == INVALID_HANDLE_VALUE) {
    _tprintf(_T("Cannot open output file. Error: %x\n"),
      GetLastError());
    return 3;
  }

  /* Generate output */
#if DEBUG
  _tprintf(_T("File=%s #val=%d: "), argv[argc-1], vetAllN);
#endif
  WriteFile(fileHandle, &vetAllN, sizeof(INT), &nOut, NULL);
  for (i = 0; i<vetAllN; i++) {
#if DEBUG
    _tprintf(_T("%d "), vetAll[i]);
#endif
    WriteFile(fileHandle, &vetAll[i], sizeof(INT), &nOut, NULL);
  }
  _tprintf(_T("\n"));

  CloseHandle(fileHandle);

  for (i = 0; i < fileN; i++) {
    free(threadData[i].vet);
  }
  free(threadData);
  free(threadHandle);
  free(threadId);
  free(vetAll);

  _tprintf(_T("End Now: "));
  _tscanf_s(_T("%d"), &n);

  return 0;
}

unsigned WINAPI threadFunction(
  LPVOID lpParam
  )
{
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

  if (ReadFile(fileHandle, &val, sizeof(INT), &nByte, NULL)
    && nByte > 0) {
    data->vetN = val;
    data->vet = (INT *)malloc(data->vetN * sizeof(INT));
    if (data->vet == NULL) {
      _tprintf(_T("Allocaton error.\n"));
      exit (1);
    }
  }

  n = 0;
  while (ReadFile(fileHandle, &val, sizeof(INT), &nByte, NULL)
    && n<data->vetN && nByte> 0) {
#if DEBUG
    _tprintf(_T("File=%s vet[%d]=%d\n"), data->fileName,
      n, val);
#endif
    data->vet[n] = val;
    n++;
  }

  sort(data->vet, data->vetN);
  CloseHandle(fileHandle);

  _endthreadex(0);
  return (0);
}

static void sort(
  INT *vet,
  INT n
  )
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
  threads_t *threadData,
  INT fileN,
  INT **vetAll,
  INT *vetAllN
  )
{
  INT *indices, *vet;
  INT i, j, n;

  n = 0;
  for (i = 0; i < fileN; i++) {
    n = n + threadData[i].vetN;
  }
  indices = (INT *)malloc(fileN * sizeof(INT));
  vet = (INT *)malloc(n * sizeof(INT));
  if (indices == NULL || vet == NULL) {
    _tprintf(_T("Allocaton error.\n"));
    exit(1);
  }
  for (i = 0; i < fileN; i++) {
    indices[i] = 0;
  }

  j = 0;
  do {
    i = findMin(threadData, indices, fileN);
    if (i >= 0) {
      vet[j++] = threadData[i].vet[indices[i]++];
    }
  } while (i >= 0);

  *vetAll = vet;
  *vetAllN = n;
  free(indices);

  return;
}

static int findMin (
  threads_t *threadData,
  INT *indices,
  INT n
  )
{
  INT i, min, minIndex;

  minIndex = (-1);
  for (i = 0; i < n; i++) {
    if (indices[i] < threadData[i].vetN) {
      if (minIndex == (-1) ||
        threadData[i].vet[indices[i]]<min) {
        minIndex = i;
        min = threadData[i].vet[indices[i]];
      }
    }
  }

  return minIndex;
}
