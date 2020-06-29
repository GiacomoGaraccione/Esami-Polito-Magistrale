/*
 * This version:
 * - Reads the input file with Windows API functions.
 *   If UNICODE and _UNICODE are disabled need 8 bit encoding input file.
 *   If UNICODE and _UNICODE are enabled need 16 bit encoding input file.
 * - Writes the output file with Windows API functions
 *   record is OK with both inputs (8 and 16 bits), but scanf
 *   works only for 8 bit encoding
 */

#if 0
#define UNICODE
#define _UNICODE
#endif

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

#define BUF_SIZE    1000
#define L         (30+1)

// struct mysU has only fileds of API Windows type
struct mys {
  DWORD id;      // also INT
  DWORD rn;      // also LONG
  TCHAR n[L];
  TCHAR s[L];
  DWORD mark;    // also INT
};

int _tmain (int argc, LPTSTR argv [])
{
  HANDLE hIn, hOut;
  DWORD i, nIn, nOut;
  TCHAR c, buffer[BUF_SIZE];
  struct mys myse;

  if (argc != 3) {
    fprintf (stderr, "Usage: cp file1 file2\n");
  Sleep(2000);
    return 1;
  }

  /*
   *  Part 1: Read ASCII file and Write Binary File
  */

  hIn = CreateFile (argv[1], GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    fprintf (stderr, "Cannot open input file. Error: %x\n", GetLastError ());
  Sleep(2000);
  return 2;
  }

  hOut = CreateFile (argv[2], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hOut == INVALID_HANDLE_VALUE) {
    fprintf (stderr, "Cannot open output file. Error: %x\n", GetLastError ());
  Sleep(2000);
  CloseHandle(hIn);
    return 3;
  }

  i = 0;
  // Read single char
  _tprintf(_T("Dedug Printing 1 (what I read from bin file):\n"));
  while (ReadFile(hIn, &c, sizeof(TCHAR), &nIn, NULL) && nIn > 0) {
    // Convert single char into a record (file line) string
    buffer[i] = c;
    i++;
    if (c == _T('\n')) { // '\r' then '\n'
      // Get fields
      _stscanf (buffer, _T("%d %d %s %s %d"),
        &myse.id, &myse.rn, myse.n, myse.s, &myse.mark);
      _tprintf (_T("-> %d %d %s %s %d <-\n"),
        myse.id, myse.rn, myse.n, myse.s, myse.mark);
      WriteFile (hOut, &myse, sizeof (struct mys), &nOut, NULL);

      i = 0;
    }
  }
  CloseHandle (hIn);
  CloseHandle (hOut);

#if 0
  {
    int i;
    _tprintf(_T("Go on? "));
    _tscanf(_T("%d"), &i);
  }
#else
  Sleep (2000);
#endif

  /*
   *  Part 2:
   *  Re-Read Binary File and Print-it-out on stdout
   */

  hIn = CreateFile (argv[2], GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Cannot open input file. Error: %x\n"),
      GetLastError ());
  Sleep(2000);
  return 2;
  }

  _tprintf(_T("Dedug Printing 2 (what I RE-read from bin file):\n"));
  while (ReadFile (hIn, &myse, sizeof (struct mys), &nIn, NULL) && nIn > 0) {
    _tprintf(_T("-> %d %ld %s %s %d <-\n"),
    myse.id, myse.rn, myse.n, myse.s, myse.mark);
  }
  CloseHandle(hIn);

#if 0
  {
    int i;
    _tprintf (_T("Go on? "));
    _tscanf (_T("%d"), &i);
  }
#else
  Sleep (2000);
#endif

  return 0;
}
