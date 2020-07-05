#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>

DWORD WINAPI tFunc(LPVOID data);

struct data {
	int i;
};

int _tmain(int argc, LPTSTR argv[]) {

	int i, n = argc - 1;
	HANDLE* th = (HANDLE* ) malloc(n * sizeof(HANDLE));
	struct data* dt = (struct data*)malloc(n * sizeof(struct data));

	for (i = 0; i < n; i++) {
		dt[i].i = i;
		th[i] = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE) tFunc, &dt[i], 0, NULL);
	}

	WaitForMultipleObjects(n, th, true, INFINITE);

	for (i = 0; i < n; i++) {
		CloseHandle(th[i]);
	}

	return 0;
}

DWORD WINAPI tFunc(LPVOID data) {
	struct data* dt = (struct data*) data;

	_tprintf(_T("th: %d\n"), dt->i);

	ExitThread(0);
}