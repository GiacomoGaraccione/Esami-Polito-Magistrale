#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>

typedef struct thread_arg {
	int id;
}threadArg;

DWORD WINAPI ThreadA(LPVOID);
DWORD WINAPI ThreadB(LPVOID);
DWORD WINAPI ThreadC(LPVOID);

HANDLE semA;
HANDLE semB;
HANDLE semC;
HANDLE mutexA, mutexB;
int countA = 0, countB = 0;

int _tmain(int argc, LPTSTR argv[]) {
	int n = _ttoi(argv[1]);

	HANDLE *threadsA = (HANDLE*) malloc(3 * n * sizeof(HANDLE));
	DWORD* threadIdsA = (DWORD*)malloc(3 * n * sizeof(DWORD));
	threadArg* valuesA = (threadArg*)malloc(3 * n * sizeof(threadArg));
	HANDLE *threadsB = (HANDLE*) malloc(2 * n * sizeof(HANDLE));
	DWORD* threadIdsB = (DWORD*)malloc(2 * n * sizeof(DWORD));
	threadArg* valuesB = (threadArg*)malloc(2 * n * sizeof(threadArg));
	HANDLE *threadsC = (HANDLE*) malloc(n * sizeof(HANDLE));
	DWORD* threadIdsC = (DWORD*)malloc(n * sizeof(DWORD));
	threadArg* valuesC = (threadArg*)malloc(n * sizeof(threadArg));

	semA = CreateSemaphore(NULL, 3, 3, NULL);
	semB = CreateSemaphore(NULL, 2, 2, NULL);
	semC = CreateSemaphore(NULL, 0, 1, NULL);
	mutexA = CreateMutex(NULL, false, NULL);
	mutexB = CreateMutex(NULL, false, NULL);

	for (int i = 0; i < 3 * n; i++) {
		valuesA[i].id = i;
		threadsA[i] = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)ThreadA, &valuesA[i], 0, &threadIdsA[i]);
	}

	for (int i = 0; i < 2 * n; i++) {
		valuesB[i].id = i;
		threadsB[i] = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)ThreadB, &valuesB[i], 0, &threadIdsB[i]);
	}

	for (int i = 0; i < n; i++) {
		valuesC[i].id = i;
		threadsC[i] = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)ThreadC, &valuesC[i], 0, &threadIdsC[i]);
	}

	WaitForMultipleObjects(3 * n, threadsA, true, INFINITE);
	WaitForMultipleObjects(2 * n, threadsB, true, INFINITE);
	WaitForMultipleObjects(n, threadsC, true, INFINITE);

	return 0;
}

DWORD WINAPI ThreadA(LPVOID arg) {
	threadArg* pt = (threadArg*)arg;
	WaitForSingleObject(semA, INFINITE);
	_tprintf(_T("A%d ", pt->id));
	WaitForSingleObject(mutexA, INFINITE);
	countA++;
	if (countA == 3 && countB == 2) {
		countA = 0;
		countB = 0;
		ReleaseSemaphore(semC, 1, 0);
	}
	ReleaseMutex(mutexA);
	ExitThread(0);
}

DWORD WINAPI ThreadB(LPVOID arg) {
	threadArg* pt = (threadArg*)arg;
	WaitForSingleObject(semB, INFINITE);
	_tprintf(_T("B%d ", pt->id));
	WaitForSingleObject(mutexB, INFINITE);
	countB++;
	if (countA == 3 && countB == 2) {
		countA = 0;
		countB = 0;
		ReleaseSemaphore(semC, 1, 0);
	}
	ReleaseMutex(mutexB);
	ExitThread(0);
}

DWORD WINAPI ThreadC(LPVOID arg) {
	threadArg* pt = (threadArg*)arg;
	WaitForSingleObject(semC, INFINITE);
	_tprintf(_T("C%d\n", pt->id));
	ReleaseSemaphore(semA, 3, 0);
	ReleaseSemaphore(semB, 2, 0);
	ExitThread(0);
}