/*
 *  StQ 15.05.2014
 *  StQ 15.05.2017
 *
 *  Traverse N directory trees in a recursive way
 *  using N threads (one for each directory tree)
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

typedef struct threads {
  DWORD tN;      // Thread Number
  TCHAR mdN[L];  // Main Directory Name
  TCHAR cdN[L];  // Current Directory Name
  DWORD rL;      // Recursive Level
} threads_t;

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
  threads_t *threadData;
  HANDLE *threadHandle;
  DWORD *threadId;

  threadData = (threads_t *)malloc((argc - 1) * sizeof(threads_t));
  threadHandle = (HANDLE *)malloc((argc - 1) * sizeof(HANDLE));
  threadId = (DWORD *)malloc((argc - 1) * sizeof(DWORD));

  for (i = 0; i<argc - 1; i++) {
    threadData[i].tN = i + 1;
    _tcscpy(threadData[i].mdN, argv[i + 1]);
    //wcscpy_s (threadData[i].mdN, 1, argv[i+1]);
    _tcscpy(threadData[i].cdN, argv[i + 1]);
    //wcscpy_s (threadData[i].cdN, sizeof (argv[i+1])+1, argv[i+1]);
    threadData[i].rL = 1;

    _tprintf(_T("---> Run Thread %d (out of %d)\n"),
      i + 1, argc - 1);
    threadHandle[i] = CreateThread(NULL, 0,
      (LPTHREAD_START_ROUTINE)threadTraverseDirectoryRecursive,
      &threadData[i], 0, &threadId[i]);

    if (threadHandle[i] == NULL) {
      ExitProcess(0);
    }
  }

  // Wait until all threads have terminated.
  WaitForMultipleObjects(argc - 1, threadHandle, TRUE, INFINITE);

#if 1
  _tprintf(_T("Go on? "));
  _tscanf(_T("%d"), &i);
#else
  Sleep(5000);
#endif

  return 0;
}

DWORD WINAPI
threadTraverseDirectoryRecursive(
  LPVOID lpParam
  )
{
  threads_t *data;

  data = (threads_t *)lpParam;

  TraverseDirectoryRecursive(data);

  ExitThread(0);
}

static void
TraverseDirectoryRecursive(
  threads_t *data
  )
{
  HANDLE SearchHandle;
  WIN32_FIND_DATA FindData;
  DWORD FType, i;
  TCHAR s[L];
  threads_t dataL;

  _stprintf(s, _T("%s\\*"), data->cdN);

  // It is IMPOSSIBILE to set the directory in a multi-thread environment
  // SetCurrentDirectory (PathName);
  SearchHandle = FindFirstFile(s, &FindData);

  do {
    FType = FileType(&FindData);

    if (FType == TYPE_FILE) {
      /* Printing */
      for (i = 0; i<data->rL; i++)
        _tprintf(_T("  "));
      _tprintf(_T("thread #=%d level=%d FILE: %s\n"),
        data->tN, data->rL, FindData.cFileName);
    }

    if (FType == TYPE_DIR) {
      // Create New Data Structure
      _tcscpy(dataL.mdN, data->mdN);
      //wcscpy_s (dataL.mdN, sizeof (data->mdN)+1, data->mdN);
      _stprintf(dataL.cdN, _T("%s\\%s"), data->cdN, FindData.cFileName);
      dataL.rL = data->rL + 1;
      dataL.tN = data->tN + 1;

      /* Printing */
      for (i = 0; i<data->rL; i++)
        _tprintf(_T("  "), data->rL);
      _tprintf(_T("thread #=%d level=%d DIR : %s\n"),
        data->tN, data->rL, data->cdN);

      /* Recur */
      TraverseDirectoryRecursive(&dataL);

      //SetCurrentDirectory (_T (".."));
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
    else FType = TYPE_DIR;

    return FType;
}
