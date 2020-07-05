#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#define NT 6

#include <windows.h>
#include <tchar.h>

struct args_t{
	DWORD i;
	LPTSTR fileName;
	DWORD *vett;
	DWORD n;
};

BOOL myCreateInputFile(DWORD in[], DWORD n, LPCTSTR path);
DWORD WINAPI foo(LPVOID arg);

int _tmain(int argc, LPTSTR argv[]) {

	DWORD in[3];
	in[0] = 2;
	in[1] = 3;
	in[2] = 5;

	if (!myCreateInputFile(in, 3, _T("./in1"))) {
		return -1;
	}
	int numFile = argc - 1;

	HANDLE ht[NT];
	struct args_t argVet[NT];
	int i, j;
	for (i = 0; i < numFile; i++) {
		argVet[i].i = i;
		argVet[i].fileName = argv[i + 1];

		ht[i] = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)foo, &argVet[i], 0, NULL);
	}

	

	WaitForMultipleObjects(numFile, ht, true, INFINITE);


	for (i = 0; i < numFile; i++) {
		CloseHandle(ht[i]);
	}


	_tprintf(_T("ho aspettato un thread\n"));

	for (i = 0; i < numFile; i++) {
		for (j = 0; j < argVet[i].n; j++) {
			_tprintf(_T("%d "), argVet[i].vett[j]);
		}
		_tprintf(_T("\n"));
	}

	return 0;
}

DWORD WINAPI foo(LPVOID arg) {

	struct args_t *a = (struct args_t *)arg;
	HANDLE h = CreateFile(a->fileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	DWORD nread, val, n = 0;
	_tprintf(_T("sono un thread: %d\n"), a->i);
	_tprintf(_T("%s\n"), a->fileName);

	if (h == INVALID_HANDLE_VALUE) {
		_tprintf(_T("could not open file\n"));
		return false;
	}

	if (ReadFile(h, &val, sizeof(DWORD), &nread, NULL) > 0) {
		a->n = val;
		a->vett = (DWORD*)malloc(val * sizeof(DWORD));
	}

	while (ReadFile(h, &val, sizeof(DWORD), &nread, NULL) && nread > 0 && n < a->n) {
		a->vett[n] = val;
		n++;
	}
	ExitThread(0);
}

BOOL myCreateInputFile(DWORD in[], DWORD n, LPCTSTR path) {
	HANDLE hw;
	DWORD i = 0;
	DWORD nOut;

	hw = CreateFile(path, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
	if (hw == INVALID_HANDLE_VALUE) {
		return false;
	}

	for (i = 0; i < n; i++) {
		if (!WriteFile(hw, &in[i], sizeof(DWORD), &nOut, NULL)) {
			return false;
		}
	}

	CloseHandle(hw);

	HANDLE hr;
	DWORD nIn = 1;
	DWORD nread;
	hr = CreateFile(path, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	if (hr == INVALID_HANDLE_VALUE) {
		_tprintf(_T("could not read file\n"));
		return false;
	}

	while (ReadFile( hr, &nread, sizeof(DWORD), &nIn, NULL ) && (nIn > 0)) {
		_tprintf(_T("%d\n"), nread);
	}

	CloseHandle(hr);

	return true;
}