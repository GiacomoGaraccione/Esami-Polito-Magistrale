/*
 *  StQ 15.05.2013
 *  StQ 15.05.2017
 *
 *  Copy a directory tree and modify files.
 *  Use a recursive function.
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

#define BUF_SIZE 16384
#define L 500

#define TYPE_FILE 1
#define TYPE_DIR 2
#define TYPE_DOT 3

static void TraverseAndModify(LPTSTR, LPTSTR);
static void MyCopyFile(WIN32_FIND_DATA, LPTSTR);
static DWORD FileType(LPWIN32_FIND_DATA);

int
_tmain(
int argc,
LPTSTR argv[]
)
{
  INT i;
  TCHAR tmpPath[L], fullPath[L];

  _tprintf(_T("\n---> Visit Dir %s\n"), argv[1]);
  GetCurrentDirectory(L, tmpPath);
  _stprintf(fullPath, _T("%s\\%s"), tmpPath, argv[2]);
  TraverseAndModify(argv[1], fullPath);

#if 1
  _tprintf(_T("Go on? "));
  _tscanf(_T("%d"), &i);
#else
  Sleep(5000);
#endif

  return 0;
}

static void TraverseAndModify(
  LPTSTR SourcePathName,
  LPTSTR DestPathName
  )
{
  HANDLE SearchHandle;
  WIN32_FIND_DATA FindData;
  DWORD FType, l;
  TCHAR NewPath[L];

  _tprintf(_T("--> Create Dir : %s\n"), DestPathName);
  CreateDirectory(DestPathName, NULL);
  SetCurrentDirectory(SourcePathName);

  SearchHandle = FindFirstFile(_T("*"), &FindData);

  do {
    FType = FileType(&FindData);

    l = _tcslen(DestPathName);
    if (DestPathName[l - 1] == '\\') {
      _stprintf(NewPath, _T("%s%s"),
        DestPathName, FindData.cFileName);
    }
    else {
      _stprintf(NewPath, _T("%s\\%s"),
        DestPathName, FindData.cFileName);
    }

    if (FType == TYPE_FILE) {
      _tprintf(_T("--> Copy FILE: %s %s\n"),
        FindData.cFileName, NewPath);
      MyCopyFile(FindData, NewPath);
    }

    if (FType == TYPE_DIR) {
      TraverseAndModify(FindData.cFileName, NewPath);
      SetCurrentDirectory(_T(".."));
    }
  } while (FindNextFile(SearchHandle, &FindData));

  FindClose(SearchHandle);

  return;
}

static void MyCopyFile(
  WIN32_FIND_DATA FindData,
  LPTSTR name2
  )
{
  HANDLE hIn, hOut;
  DWORD nIn, nOut;
  CHAR buffer[BUF_SIZE];
  TCHAR newLine[L];

  hIn = CreateFile(FindData.cFileName, GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  hOut = CreateFile(name2, GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE || hOut == INVALID_HANDLE_VALUE) {
    fprintf(stderr, "Cannot open file\n");
    exit(1);
  }

#if 0
  /* Write Header: Name and Size */
  WriteFile(hOut, FindData.cFileName, sizeof(FindData.cFileName), &nOut, NULL);
  WriteFile(hOut, &FindData.nFileSizeLow, sizeof(FindData.nFileSizeLow),
    &nOut, NULL);
#endif
#if 0
  /* Write Header: Entire Structure */
  WriteFile(hOut, &FindData, sizeof(WIN32_FIND_DATA), &nOut, NULL);
#endif
#if 1
  /* Write Header: Name and Size with new-lines */
  _stprintf(newLine, _T("%s\n%d\n"),
    FindData.cFileName, FindData.nFileSizeLow);
  WriteFile(hOut, newLine, (_tcslen(newLine) * sizeof(TCHAR)),
    &nOut, NULL);
#endif

  while (ReadFile(hIn, buffer, BUF_SIZE, &nIn, NULL) && nIn > 0) {
    WriteFile(hOut, buffer, nIn, &nOut, NULL);
    if (nIn != nOut) {
      fprintf(stderr, "Fatal write error: %x\n", GetLastError());
      CloseHandle(hIn); CloseHandle(hOut);
      exit(1);
    }
  }

  CloseHandle(hIn);
  CloseHandle(hOut);
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
