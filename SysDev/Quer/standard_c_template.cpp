#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>

int _tmain(int argc, LPTSTR argv[]) {

	_tprintf(_T("test\n"));

	return 0;
}