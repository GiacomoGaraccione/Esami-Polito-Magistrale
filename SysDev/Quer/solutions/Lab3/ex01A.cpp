/*
 *  This version:
 *  - Reads the input file with standard C library functions
 *    using a 8-bit encoding.
 *
 *    Observation:
 *    Standard fopen does not work with 16-bit encoding.
 *    To support Unicode file streams, the desired encoding must be specified
 *    FILE *fp = fopen("filename", "access mode, ccs=encoding");
 *    Allowed values of encoding are UNICODE, UTF-8, and UTF-16LE.
 *    When a file is opened in Unicode mode, input functions translate the data
 *    into UTF-16 data stored as type wchar_t. 
 *    See API documentation for Windows API fopen, _wfopen, _tfopen.
 *
 *  - Writes the output file with Windows API functions.
 *    In this way it may generate both 8 and 16-bit representations
 *    (without/with UNICODE and _UNICODE definitions ... see size of
 *    output fine within "file properties").
 */

#if 1
#define UNICODE
#define _UNICODE
#endif

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

#define L (30+1)

struct mys {
  DWORD id;
  DWORD rn;
  TCHAR n[L];
  TCHAR s[L];
  DWORD mark;
};

int _tmain(int argc, LPTSTR argv[])
{
  FILE *fp = NULL;
  HANDLE hIn, hOut;
  DWORD i, nIn, nOut;
  struct mys myse;

  /*
   *  Part 1: Read ASCII file and Write Binary File
   */

  if (argc != 3) {
    fprintf(stderr, "Usage: cp file1 file2\n");
    Sleep(3000);
    return 1;
  }

#if 1
  fp = _tfopen(argv[1], _T("r"));
  if (fp == NULL) {
    _tprintf(_T("Cannot open output file %s.\n"), argv[1]);
    Sleep(3000);
    return 3;
    }
#else
  {
    errno_t err;
#ifdef UNICODE
    err = _wfopen_s (&fp, argv[1], _T("r"));
#else
    err = fopen_s (&fp, argv[1], "r");
#endif
    if (err != 0) {
      _tprintf(_T("Cannot open output file %s.\n"), argv[1]);
      return 3;
    }
    }
#endif

  hOut = CreateFile(argv[2], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hOut == INVALID_HANDLE_VALUE) {
    Sleep(3000);
    _tprintf(_T("Cannot open output file. Error: %x\n"),
      GetLastError());
    return 3;
  }

  _tprintf(_T("Dedug Printing 1 (what I read from ASCII and write to bin):\n"));
  // Read Input File (ASCII file with 8-bit encoding for chars)
  while (_ftscanf(fp, _T("%d%ld%s%s%d"),
    &myse.id, &myse.rn, myse.n, myse.s, &myse.mark) != EOF) {
    // Debug Printing
    _tprintf(_T("-> %d %ld %s %s %d <-\n"),
      myse.id, myse.rn, myse.n, myse.s, myse.mark);
    WriteFile(hOut, &myse, sizeof(struct mys), &nOut, NULL);
  }

  CloseHandle(hOut);

#if 0
  {
    int i;
    _tprintf(_T("Go on? "));
    _tscanf(_T("%d"), &i);
  }
#else
  Sleep(3000);
#endif

  /*
   *  Part 2:
   *  Re-Read Binary File and Print-it-out on stdout
   */

  hIn = CreateFile(argv[2], GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf(_T("Cannot open input file. Error: %x\n"),
      GetLastError());
    return 2;
  }

  _tprintf(_T("Dedug Printing 2 (what I RE-read from bin file):\n"));
  while (ReadFile(hIn, &myse, sizeof(struct mys), &nIn, NULL) && nIn > 0) {
    _tprintf(_T("-> %d %ld %s %s %d <-\n"),
      myse.id, myse.rn, myse.n, myse.s, myse.mark);
  }
  CloseHandle(hIn);

#if 0
  {
    int i;
    _tprintf (_T("Go on? "));
    _tscanf(_T("%d"), &i);
  }
#else
  Sleep (5000);
#endif

  return 0;
}
