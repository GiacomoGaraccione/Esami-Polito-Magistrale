/*
*  StQ 07.07.2017
*  Examination Solution: file encoding
*  from txt to bin
*  (txt has to be in ASCII format)
*/

#if 0
#define UNICODE
#define _UNICODE
#endif

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

#define L 30+1

int _tmain (int argc, LPTSTR argv [])
{
  FILE *fp = NULL;
  HANDLE hIn, hOut;
  DWORD nIn, nOut;
  errno_t err;
  INT i, n;
  FLOAT f;

  if (argc != 3) {
    fprintf (stderr, "Usage: cp file1 file2\n");
    return 1;
  }

  /*
  *  Part 1: Read ASCII file and Write Binary File
  */

#ifdef UNICODE
  err = _wfopen_s(&fp, argv[1], _T("r"));
#else
  err = fopen_s(&fp, argv[1], "r");
#endif
  if (err != 0) {
    _tprintf (_T("Cannot open output file %s.\n"), argv[1]);
    return 3;
  }

  hOut = CreateFile (argv[2], GENERIC_WRITE, 0, NULL,
    CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hOut == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Cannot open output file. Error: %x\n"),
      GetLastError ());
    return 3;
  }

  _tprintf (_T("Debug Printing 1 (what I read from ASCII and write to bin):\n"));
  if (_ftscanf(fp, _T("%d"), &n) == EOF) {
	  _tprintf(_T("Error reading file.\n"));
	  exit(1);
  }
  _tprintf(_T("n=%d\n"), n);
  WriteFile(hOut, &n, sizeof(INT), &nOut, NULL);

  i = 0;
  while (_ftscanf(fp, _T("%f"), &f) != EOF) {
	  // Debug Printing
	  _tprintf(_T("%f "), f);
	  if ((++i) == 6) {
		  _tprintf(_T("\n"));
		  i = 0;
	  }
    WriteFile (hOut, &f, sizeof (FLOAT), &nOut, NULL);
  }

  CloseHandle (hOut);
  fclose(fp);

#if 1
  _tprintf (_T("Go on? "));
  _tscanf (_T("%d"), &i);
#else
  Sleep (5000);
#endif

  /*
   *  Re-Read Binary File and Print-it-out on stdout
   */

  hIn = CreateFile (argv[2], GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (hIn == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Cannot open input file. Error: %x\n"),
      GetLastError ());
    return 2;
  }

  _tprintf (_T("Dedug Printing 2 (what I RE-read from bin file):\n"));
  ReadFile(hIn, &n, sizeof(INT), &nIn, NULL);
  _tprintf(_T("%d\n"), n);
  i = 0;
  while (ReadFile(hIn, &f, sizeof(FLOAT), &nIn, NULL) && nIn > 0) {
	  // Debug Printing
	  _tprintf(_T("%f "), f);
	  if ((++i) == 6) {
		  _tprintf(_T("\n"));
		  i = 0;
	  }
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
