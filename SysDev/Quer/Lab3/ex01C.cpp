/*
 * This version
 * - Reads input file using Windows API functions and it creates
 *   a structure with standard C fields only (8-bit strings)
 * - Converts the previous C structure into a similar one with
 *   Windows API fields only.
 *   This is done using ASCII-to-UNICODE string conversion
 * - Writes this last structure into the output file in
 *   UNICODE format
 */

#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

#define BUF_SIZE 1000
#define L 30+1

// struct mys has only fields of standard C type
struct mys {
  int id;
  long int rn;
  char n[L];
  char s[L];
  int mark;
};

// struct mysU has only fileds of API Windows type
struct mysU {
  DWORD id;  // also INT
  DWORDLONG rn;  // also LONG
  TCHAR n[L];
  TCHAR s[L];
  DWORD mark;  // also INT
};

int _tmain (int argc, LPTSTR argv [])
{
  HANDLE hIn, hOut;
  DWORD i, nIn, nOut;
  char c, buffer[BUF_SIZE];
  struct mys myse;
  struct mysU myseU;

  if (argc != 3) {
    fprintf (stderr, "Usage: cp file1 file2\n");
    return 1;
  }

  /*
   *  Part 1: Read ASCII file and Write Binary File
  */

  hIn = CreateFile (argv[1], GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    fprintf (stderr, "Cannot open input file. Error: %x\n", GetLastError ());
    return 2;
  }

  hOut = CreateFile (argv[2], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hOut == INVALID_HANDLE_VALUE) {
    fprintf (stderr, "Cannot open output file. Error: %x\n", GetLastError ());
    CloseHandle(hIn);
    return 3;
  }

  i = 0;
  // Read single char
  while (ReadFile (hIn, &c, 1, &nIn, NULL) && nIn > 0) {
    // Convert single char into a record (file line) string
    buffer[i] = c;
    i++;
    if (c == '\n') {
      // Get fields
      sscanf (buffer, "%d%ld%s%s%d",
        &myse.id, &myse.rn, myse.n, myse.s, &myse.mark);
      printf ("-> %d %ld %s %s %d <-\n",
        myse.id, myse.rn, myse.n, myse.s, myse.mark);

      // Convert standard C struct into Windows API struct 
      // Note that swprintf can convert the record string into myseU directly
      myseU.id = myse.id;
      myseU.rn = myse.rn;
      swprintf (myseU.n, L, L"%hs", myse.n);
      swprintf (myseU.s, L, L"%hs", myse.s);
      myseU.mark = myse.mark;
      WriteFile (hOut, &myseU, sizeof (struct mysU), &nOut, NULL);

      i = 0;
    }
  }
  CloseHandle (hIn);
  CloseHandle (hOut);

#if 1
  _tprintf (_T("Go on? "));
  _tscanf (_T("%d"), &i);
#else
  Sleep (5000);
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
    return 2;
  }

  // To print the structure on standard outut *but* in binary form use
  // hOut = GetStdHandle(STD_OUTPUT_HANDLE);
  // and the
  // WriteFile(hOut, &myseU, sizeof(struct mysU), &nOut, NULL);
  // whithin the cycle
  _tprintf(_T("Dedug Printing 2 (what I RE-read from bin file):\n"));
  while (ReadFile (hIn, &myseU, sizeof (struct mysU), &nIn, NULL) && nIn > 0) {
    // Once read back-convertion
    // Note "manual" string conversion from 16-bits to 8-bits
    _tprintf(_T("-> %d %ld "), myse.id, myse.rn);
    for (i=0; i<=_tcsclen ((const wchar_t *) myseU.n); i++)
      _tprintf (_T("%c"), (char) myseU.n[i]);
    _tprintf(_T(" "));
    for (i = 0; i <= _tcsclen((const wchar_t *)myseU.s); i++)
      _tprintf (_T("%c"), (char) myseU.s[i]);
    _tprintf (_T(" %d <-\n"), myseU.mark);
  }
  CloseHandle (hIn);

#if 1
  _tprintf (_T("Go on? "));
  _tscanf (_T("%d"), &i);
#else
  Sleep (5000);
#endif

  return 0;
}
