/*
 *  StQ 15.05.2014
 *  StQ 01.06.2016
 *  StQ 15.05.2017
 *
 *  Compare N directory trees in a recursive way
 *  Use N threads, one for each directory tree, plus 1 to compare entries.
 *  Use string "EndOfDirectory" to deal with "equivalent but shorter"
 *  directories.
 *
 */

#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS
#define _CRT_NON_CONFORMING_SWPRINTFS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>
#include <io.h>

#define TYPE_FILE 1
#define TYPE_DIR 2
#define TYPE_DOT 3

#define L 256

// Reading Threads
typedef struct threads {
  DWORD tN;      // Thread Number
  TCHAR cdN[L];  // Current Directory Name
  TCHAR cfN[L];  // Current File Name
  HANDLE se;
} threads_t;

// Comparing Thread
typedef struct threadC {
  threads_t *s;  // Pointer to the thread array
  DWORD nt;      // Number of threads
} threadC_t;

// Semaphore for the comparing thread
HANDLE se;

DWORD WINAPI threadCompare(LPVOID);
DWORD WINAPI threadTraverseDirectoryRecursive(LPVOID);
static void TraverseDirectoryRecursive(threads_t *);
DWORD FileType(LPWIN32_FIND_DATA);

int
_tmain(
  int argc,
  LPTSTR argv[]
  )
{
  int i;
  threadC_t tcD;
  threads_t *threadData;
  HANDLE *threadHandle, tcH;
  DWORD *threadId, tcId, retVal;

  threadData = (threads_t *)malloc((argc - 1) * sizeof(threads_t));
  threadHandle = (HANDLE *)malloc((argc - 1) * sizeof(HANDLE));
  threadId = (DWORD *)malloc((argc - 1) * sizeof(DWORD));

  tcD.nt = argc - 1;
  tcD.s = threadData;
  se = CreateSemaphore(NULL, 0, argc-1, NULL);
  tcH = CreateThread(NULL, 0,
    (LPTHREAD_START_ROUTINE)threadCompare,
    &tcD, 0, &tcId);

  for (i = 0; i<argc - 1; i++) {
    threadData[i].tN = i + 1;
    _tcscpy(threadData[i].cdN, argv[i + 1]);
    //wcscpy_s (threadData[i].cdN, sizeof (argv[i+1])+1, argv[i+1]);
    threadData[i].se = CreateSemaphore(NULL, 0, 1, NULL);

    _tprintf(_T("--> Run Thread %d (out of %d)\n"),
      i + 1, argc - 1);
    threadHandle[i] = CreateThread(NULL, 0,
      (LPTHREAD_START_ROUTINE)threadTraverseDirectoryRecursive,
      &threadData[i], 0, &threadId[i]);

    if (threadHandle[i] == NULL) {
      ExitProcess(0);
    }
  }

  // Straighforward version: wait AT MOST 1 sec then exit
  // (INFINITE -> 1000)
  // for "equivalent but shorter" directories
  retVal = WaitForMultipleObjects(argc - 1, threadHandle, TRUE,
    INFINITE);
  _tprintf(_T("--> OK directories are equivalent.\n"));

#if 1
  _tprintf(_T("Go on? "));
  wscanf_s(_T("%d"), &i);
  //_tscanf (_T("%d"), &i);
#endif

  return 0;
}

DWORD WINAPI
threadCompare(
  LPVOID lpParam
  )
{
  DWORD i, nEnded;
  threadC_t *data;

  data = (threadC_t *)lpParam;

  while (1) {
    for (i = 0; i<data->nt; i++) {
      WaitForSingleObject(se, INFINITE);
    }
    _tprintf(_T("Entry: %s "), data->s[0].cfN);
    nEnded = 0;
    for (i = 0; i<data->nt; i++) {
      if (_tcscmp(data->s[i].cfN, _T("EndOfDirectory")) == 0) {
        nEnded++;
      } else {
        if (i>0 && (_tcscmp(data->s[0].cfN, data->s[i].cfN) != 0)) {
          _tprintf(_T("- %s DIFFER.\n"), data->s[i].cfN);
          _tprintf(_T("--> KO directories differ. Stop All Threads.\n"));
#if 1
          _tprintf(_T("Go on? "));
          wscanf_s(_T("%d"), &i);
#endif
          exit(1);
        }
      }
    }
    if (nEnded == 0 || nEnded == data->nt) {
      _tprintf(_T("- All OK.\n"));
    }
    else {
      _tprintf(_T("--> KO - ENDED directory. Stop All Threads.\n"));
#if 1
      _tprintf(_T("Go on? "));
      wscanf_s(_T("%d"), &i);
#endif
      exit(1);
    }
    // Release All Reading Threads
    for (i = 0; i<data->nt; i++) {
      ReleaseSemaphore(data->s[i].se, 1, NULL);
    }
  }

  ExitThread(0);
}

DWORD WINAPI
  threadTraverseDirectoryRecursive(
  LPVOID lpParam
  )
{
  threads_t *data;

  data = (threads_t *)lpParam;

  TraverseDirectoryRecursive(data);
  _tcscpy(data->cfN, _T("EndOfDirectory"));
  ReleaseSemaphore(se, 1, NULL);

  ExitThread(0);
}

static void
  TraverseDirectoryRecursive(
  threads_t *data
  )
{
  HANDLE SearchHandle;
  WIN32_FIND_DATA FindData;
  DWORD FType;
  TCHAR s1[L], s2[L];

  _stprintf(s1, _T("%s\\*"), data->cdN);

  // It is IMPOSSIBILE to set the directory in a multi-thread environment
  // SetCurrentDirectory (PathName);
  SearchHandle = FindFirstFile(s1, &FindData);

  do {
    FType = FileType(&FindData);

    if (FType == TYPE_FILE || FType == TYPE_DIR) {
      _tcscpy(data->cfN, FindData.cFileName);
      ReleaseSemaphore(se, 1, NULL);
      WaitForSingleObject(data->se, INFINITE);
    }

    if (FType == TYPE_DIR) {
      // Update Data Structure
      _tcscpy(s1, data->cdN);
      _stprintf(s2, _T("%s\\%s"), data->cdN, FindData.cFileName);
      _tcscpy(data->cdN, s2);

      /* Recur */
      TraverseDirectoryRecursive(data);

      // Backtrack Data Structure
      _tcscpy(data->cdN, s1);
    }
  } while (FindNextFile(SearchHandle, &FindData));

  FindClose(SearchHandle);

  return;
}

static DWORD
FileType(
  LPWIN32_FIND_DATA pFileData
  )
{
  BOOL IsDir;
  DWORD FType;

  FType = TYPE_FILE;
  IsDir = (pFileData->dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) != 0;

  if (IsDir)
    if (lstrcmp(pFileData->cFileName, _T(".")) == 0
      || lstrcmp(pFileData->cFileName, _T("..")) == 0)
      FType = TYPE_DOT;
    else
      FType = TYPE_DIR;

  return FType;
}
