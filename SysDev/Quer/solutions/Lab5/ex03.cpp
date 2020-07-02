/*
 *  StQ 07.07.2017
 *
 *  Examination Solution
 *  - random file access (in R and W)
 *  - 2 barriers
 *  - election strategy
 */

#define UNICODE
#define _UNICODE
#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <process.h>
#include <stdio.h>

#define DEBUG 0
#define L     (30+1)

/*
 * Select thread calls as:
 * _beginthreadex IFF 1
 * createThread IFF 0
 */
#define THREAD_CALL 0

// Global structures
typedef struct threads {
  INT id;
  LPTSTR name;
  INT threadNum, firstOne;
  FLOAT var, coef;
  FLOAT term;
} threads_t;

typedef struct counter_s {
  INT count;  // Counter for Barrier
  HANDLE mt;  // Mutex for Barrier
} counter_t;

// Global variable
threads_t *threadData;
HANDLE barrier1;  // Semaphore for Barrier 1
HANDLE barrier2;  // Semaphore for Barrier 2
counter_t *counter;

void overlapped_set(OVERLAPPED *, DWORD);
void filePrint(LPCTSTR);
DWORD WINAPI threadFunction(LPVOID);

int _tmain (int argc, LPTSTR argv [])
{
  HANDLE hIn, *threadHandle; 
  INT i, threadNum;
  DWORD *threadId, nIn;

  // Debug
  _tprintf(_T("Input File (debug printing):\n"));
  filePrint(argv[1]);

  // Read Polynomial Degree
  hIn = CreateFile (argv[1], GENERIC_READ,
    FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING,
    FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Open file error: %x\n"), GetLastError ());
    return 2;
  }
  ReadFile(hIn, &threadNum, sizeof(INT), &nIn, NULL);
  CloseHandle(hIn);

  // Allocate Data for Threads
  threadData = (threads_t *) malloc (threadNum * sizeof (threads_t));
  threadHandle = (HANDLE *) malloc (threadNum * sizeof (HANDLE));
  threadId = (DWORD *) malloc (threadNum * sizeof(DWORD));

  //InitializeCriticalSection (&cs);
  counter = (counter_t *)malloc(sizeof(counter_t));
  counter->count = 0;
  counter->mt = CreateMutex (NULL, FALSE, NULL);
  barrier1 = CreateSemaphore (NULL, 0, threadNum, NULL);
  barrier2 = CreateSemaphore(NULL, 0, threadNum, NULL);

  // Run threads
  for (i=0; i<threadNum; i++) {
    threadData[i].name = argv[1];
    threadData[i].id = i+1;
    threadData[i].threadNum = threadNum;

    threadHandle[i] = CreateThread (NULL, 0,
      (LPTHREAD_START_ROUTINE) threadFunction, &threadData[i].id,
      0, &threadId[i]);

    if (threadHandle[i] == NULL) {
      ExitProcess(0);
    }
  }

  // Wait until all threads have terminated.
  WaitForMultipleObjects (threadNum, threadHandle, TRUE, INFINITE);
  for (i=0; i<threadNum; i++) {
    CloseHandle(threadHandle[i]);
  }

  free (threadData);
  free (threadHandle);
  free (threadId);

  // Debug
  _tprintf(_T("Output File (debug printing):\n"));
  filePrint(argv[1]);

  _tprintf(_T("Go on: "));
  _tscanf (_T("%d"), &i); 
  
  return 0;
}

DWORD WINAPI threadFunction(LPVOID lpParam) {
  HANDLE hIn;
  FLOAT sum;
  INT *p, threadId, i, rowN;
  DWORD nIn;
  OVERLAPPED ov = { 0, 0, 0, 0, NULL };
  DWORD n;

  p = (INT *) lpParam;
  threadId = *p  - 1;

  // Open file to avoid collisions on the HANDLE
  hIn = CreateFile((threadData+threadId)->name, GENERIC_READ | GENERIC_WRITE,
    FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING,
    FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Open file error: %x\n"), GetLastError ());
    return 2;
  }

  // Record counter (for random access)
  rowN = 0;
  while (1) {
    // Check for EOF (the previous record was the last one)
	n = rowN * ((threadData + threadId)->threadNum) * 2;
	overlapped_set(&ov, n);
    ReadFile(hIn, &(threadData + threadId)->var, sizeof(FLOAT), &nIn, &ov);
    if (nIn == 0){
      break;
    }

    // Read variable value
	n = rowN * ((threadData + threadId)->threadNum) * 2;
	overlapped_set(&ov, n);
	ReadFile(hIn, &(threadData + threadId)->var, sizeof(FLOAT), &nIn, &ov);

    // Read coefficient value
	n = rowN * ((threadData + threadId)->threadNum) * 2 + ((threadData + threadId)->id + 1);
	overlapped_set(&ov, n);
    ReadFile(hIn, &(threadData+threadId)->coef, sizeof(FLOAT), &nIn, &ov);

    // Term computation
    (threadData + threadId)->term = 1;
    for (i = 0; i < (threadData + threadId)->id; i++) {
      (threadData + threadId)->term =
        (threadData + threadId)->term * (threadData + threadId)->var;
    }
    (threadData + threadId)->term =
      (threadData + threadId)->term * (threadData + threadId)->coef;
#if DEBUG
    _tprintf(_T("Thread %d read var=%f coeff=%f term=%f reached barrier\n"),
      (threadData + threadId)->id, (threadData + threadId)->var,
      (threadData + threadId)->coef, (threadData + threadId)->term);
#endif

    // Barrier 1
    // Set first thread, blocks all on barrier 1
    WaitForSingleObject(counter->mt, INFINITE);
    counter->count++;
    if (counter->count == 1) {
      // I'm the first one
      (threadData+threadId)->firstOne = 1;
    } else {
      // I'm NOT the first one
      (threadData+threadId)->firstOne = 0;
    }
    if (counter->count == (threadData+threadId)->threadNum) {
      // It also possible to make:
      // ReleaseSemaphore(barrier1, (threadData + threadId)->threadNum, NULL);
      for (i = 0; i < (threadData + threadId)->threadNum; i++) {
        ReleaseSemaphore(barrier1, 1, NULL);
      }
    }
    ReleaseMutex(counter->mt);
    WaitForSingleObject(barrier1, INFINITE);

    // Election: The first one compute final value and write it back to the file
    if ((threadData+threadId)->firstOne == 1) {
      // Read constant value
      n = rowN * ((threadData + threadId)->threadNum) * 2 + 1;
	  overlapped_set(&ov, n);
      ReadFile(hIn, &sum, sizeof(FLOAT), &nIn, &ov);
      // Compute sum
      for (i = 0; i < (threadData + threadId)->threadNum; i++) {
        sum += (threadData + i)->term;
      }
#if DEBUG
      _tprintf(_T("I'm the first one -> Thread %d Sum=%f\n"),
        (threadData + threadId)->id, sum);
#endif
      // Write result on file
	  n = (rowN + 1) * ((threadData + threadId)->threadNum) * 2 - 1;
	  overlapped_set(&ov, n);
      WriteFile(hIn, &sum, sizeof(FLOAT), &nIn, &ov);
    }

    // Barrier 2:
    // To respect specs ALL threads await first one to move to next record
    // (pay attention not to have one thread cycling more than once while
    // other await)
    WaitForSingleObject(counter->mt, INFINITE);
    counter->count--;
    if (counter->count == 0) {
      for (i = 0; i < (threadData+threadId)->threadNum; i++) {
        ReleaseSemaphore(barrier2, 1, NULL);
      }
    }
    ReleaseMutex(counter->mt);
    WaitForSingleObject(barrier2, INFINITE);

    rowN++;
  }

  CloseHandle(hIn);

  ExitThread (0);
}

void overlapped_set(OVERLAPPED *ov, DWORD n) {
  LARGE_INTEGER filePos;

  filePos.QuadPart = sizeof(INT) + n * sizeof(FLOAT);
  ov->Offset = filePos.LowPart;
  ov->OffsetHigh = filePos.HighPart;
  ov->hEvent = 0;
	
  return;
}

void filePrint(LPCTSTR name) {
  HANDLE hIn;
  FLOAT f;
  INT i, n;
  DWORD nIn;

  hIn = CreateFile (name, GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Cannot open input file. Error: %x\n"),
      GetLastError());
    exit (1);
  }

  ReadFile(hIn, &n, sizeof(INT), &nIn, NULL);
  _tprintf(_T("%d\n"), n);
  i = 0;
  while (ReadFile(hIn, &f, sizeof(FLOAT), &nIn, NULL) && nIn > 0) {
    _tprintf(_T("%f "), f);
    if ((++i) == 6) {
      _tprintf(_T("\n"));
      i = 0;
    }
  }
  CloseHandle(hIn);

  return;
}
