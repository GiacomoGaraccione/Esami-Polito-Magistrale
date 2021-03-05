#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>

struct dataL2R {
	int time_A_L2R;
	int time_T_L2R;
	int number_L2R;
	HANDLE semL2R;
};

struct dataR2L {
	int time_A_R2L;
	int time_T_R2L;
	int number_R2L;
	HANDLE semR2L;
};

DWORD WINAPI L2R(LPVOID);
DWORD WINAPI R2L(LPVOID);

int _tmain(int argc, LPTSTR argv[]) {

	HANDLE hL2R, hR2L;
	struct dataL2R dL2R;
	dL2R.number_L2R = 3;

	struct dataR2L dR2L;
	dR2L.number_R2L = 4;

	//i semafori contano quanti "posti liberi" ci sono nel tunnel
	dL2R.semL2R = CreateSemaphore(NULL, dL2R.number_L2R, dL2R.number_L2R, NULL);
	dR2L.semR2L = CreateSemaphore(NULL, dR2L.number_R2L, dR2L.number_R2L, NULL);

	

	hL2R = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)L2R, &dL2R, 0, NULL);
	hR2L = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)R2L, &dR2L, 0, NULL);

	WaitForSingleObject(hL2R, INFINITE);
	WaitForSingleObject(hR2L, INFINITE);

	CloseHandle(dL2R.semL2R);
	CloseHandle(dR2L.semR2L);
	CloseHandle(hL2R);
	CloseHandle(hR2L);

	return 0;
}

DWORD WINAPI R2L(LPVOID data) {
	struct dataR2L* d = (struct dataR2L*)data;

	_tprintf(_T("r2l: %d\n"), d->number_R2L);



	ExitThread(0);
}

DWORD WINAPI L2R(LPVOID data) {
	struct dataL2R* d = (struct dataL2R*)data;

	_tprintf(_T("r2l: %d\n"), d->number_L2R);

	ExitThread(0);
}