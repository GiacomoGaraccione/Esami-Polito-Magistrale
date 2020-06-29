/*
 *  StQ 01.05.2013
 *  File conversione:
 *  integer list from ASCII to binary
 */

#define UNICODE
#define _UNICODE

#define _CRT_DEFINE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

int _tmain (
  int argc,
  LPTSTR argv[]
  )
{
  FILE *fp = NULL;
  HANDLE hIn, hOut;
  DWORD nIn, nOut;
  errno_t err;
  INT i, n;

  /*
   *  Part 1: Read ASCII file and Write Binary File
   */

  if (argc != 3) {
    fprintf(stderr, "Usage: cp file1 file2\n");
    return 1;
  }

  err = _wfopen_s(&fp, argv[1], _T("r"));
  if (err != 0) {
    _tprintf(_T("Cannot open output file %s.\n"), argv[1]);
    return 3;
  }

  hOut = CreateFile(argv[2], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hOut == INVALID_HANDLE_VALUE) {
    _tprintf(_T("Cannot open output file. Error: %x\n"),
      GetLastError());
    return 3;
  }

  _tprintf(_T("Dedug Printing 1 (from ASCCI to BINARY):\n"));
  while (_ftscanf_s(fp, _T("%d"), &n) != EOF) {
    _tprintf(_T("%d "), n);
    WriteFile(hOut, &n, sizeof(INT), &nOut, NULL);
  }
  _tprintf(_T("\n"));

  CloseHandle(hOut);

#if 0
  _tprintf(_T("Go on? "));
  _tscanf(_T("%d"), &i);
#else
  Sleep(5000);
#endif

  /*
   *  Re-Read Binary File and Print-it-out on stdout
   */

  hIn = CreateFile(argv[2], GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf(_T("Cannot open input file. Error: %x\n"),
      GetLastError());
    return 2;
  }

  _tprintf(_T("Dedug Printing 2 (FROM BINARY TO ASCII - backward):\n"));
  while (ReadFile(hIn, &n, sizeof(INT), &nIn, NULL) && nIn > 0) {
    _tprintf(_T("%d "), n);
  }
  _tprintf(_T("\n"));

  CloseHandle(hIn);

#if 0
  _tprintf(_T("Go on? "));
  _tscanf(_T("%d"), &i);
#else
  Sleep(5000);
#endif

  return 0;
}
