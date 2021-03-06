/*
 *  Version using file pointers (SetFilePointerEx).
 *  Input can have a 8-bit or 16-bit encoding
 *  (define UNICODE and _UNICODE appropriately)
 *  must be defined accordingly
 */

#if 1
#define UNICODE
#define _UNICODE
#endif

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

#define L 30+1

struct mys {
  INT id;
  LONG rn;
  TCHAR n[L];
  TCHAR s[L];
  INT mark;
};

int _tmain (int argc, LPTSTR argv [])
{
  LARGE_INTEGER filePos;
  FILE *fp = NULL;
  HANDLE h;   
  DWORD end, n;
  TCHAR choice[L];
  struct mys myse;
  
  h = CreateFile (argv[1], GENERIC_READ | GENERIC_WRITE,
    FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
  if (h == INVALID_HANDLE_VALUE) {
    _tprintf (_T("Cannot open input file. Error: %x\n"), GetLastError ());
    return 2;
  }

  end = 0 ;
  do {
    _tprintf (_T("Selection (Read=R, Write=W, End=E): "));
#ifdef _UNICODE
     wscanf_s (_T("%s"), choice, L);
#else
    _tscanf (_T("%s"), choice); 
#endif

    if (_tcscmp (choice, _T("R")) == 0) {
      _tprintf (_T("Record: "));
#ifdef _UNICODE
      wscanf_s (_T("%d"), &n); 
#else
      _tscanf (_T("%d"), &n); 
#endif

      filePos.QuadPart = (n-1) * sizeof (struct mys);
      SetFilePointerEx (h, filePos, NULL, FILE_BEGIN);
      ReadFile (h, &myse, sizeof (struct mys), &n, NULL);
      _tprintf (_T("-> %d %ld %s %s %d <-\n"),
        myse.id, myse.rn, myse.n, myse.s, myse.mark);
    }

    if (_tcscmp (choice, _T("W")) == 0) {
      _tprintf (_T("Data (id #register name1 name2 mark): "));
#ifdef _UNICODE
       wscanf_s (_T("%d%ld%s%s%d"),
         &myse.id, &myse.rn, myse.n, L, myse.s, L, &myse.mark);
#else
      _tscanf (_T("%d%ld%s%s%d"),
         &myse.id, &myse.rn, myse.n, myse.s, &myse.mark);
#endif

      filePos.QuadPart = (myse.id-1) * sizeof (struct mys);
      SetFilePointerEx (h, filePos, NULL, FILE_BEGIN);
      WriteFile (h, &myse, sizeof (struct mys), &n, NULL);
      _tprintf (_T("-> %d %ld %s %s %d <-\n"),
         myse.id, myse.rn, myse.n, myse.s, myse.mark);
    }

    if (_tcscmp (choice, _T("E")) == 0) {
      end = 1;
      _tprintf (_T("End Program.\n"));
    }

  } while (end == 0);


  CloseHandle (h);

  return 0;
}
