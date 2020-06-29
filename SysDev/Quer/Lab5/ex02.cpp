/*
 * StQ 06.06.2018
 * One-way tunnel (or bridge)
 * (Checked on Visual Studion 2013)
 */

#define _CRT_SECURE_NO_WARNINGS

#ifndef UNICODE
#define UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <tchar.h>
#include <stdio.h>

typedef struct manager_s {
  DWORD time_A_L2R;
  DWORD time_A_R2L;
  DWORD time_T_L2R;
  DWORD time_T_R2L;
  DWORD n_L2R;
  DWORD n_R2L;
  DWORD passed_L2R;
  DWORD passed_R2L;
  HANDLE sem_L2R;
  HANDLE sem_R2L;
  HANDLE sem_bridge;
} manager_t;

DWORD WINAPI managerF_L2R (LPVOID);
DWORD WINAPI managerF_R2L (LPVOID);
DWORD WINAPI handlerF_L2R (LPVOID);
DWORD WINAPI handlerF_R2L (LPVOID);

INT _tmain(INT argc, LPTSTR argv[]) {
  manager_t managerS;
  HANDLE managerH_L2R, managerH_R2L;

  // check number of parameters
  if (argc < 6) {
    _ftprintf(stderr, _T("Usage: %s time_A_L2R time_A_R2L time_T_L2R time_T_R2L n_L2R n_R2L\n"),
    argv[0]);
    return 1;
  }

  managerS.time_A_L2R = _ttoi(argv[1]);
  managerS.time_A_R2L = _ttoi(argv[2]);
  managerS.time_T_L2R = _ttoi(argv[3]);
  managerS.time_T_R2L = _ttoi(argv[4]);
  managerS.n_L2R = _ttoi(argv[5]);
  managerS.n_R2L = _ttoi(argv[6]);
  managerS.passed_L2R = 0;
  managerS.passed_R2L = 0;

  _ftprintf(stdout,
    _T("time_A_L2R:%u time_A_R2L:%u time_T_L2R:%u time_t_R2L:%u nL2R:%u nR2L:%u\n\n"),
    managerS.time_A_L2R, managerS.time_A_R2L, managerS.time_T_L2R,
  managerS.time_T_R2L, managerS.n_L2R, managerS.n_R2L);

  managerS.sem_L2R = CreateSemaphore (NULL, 1, managerS.n_L2R, NULL);
  managerS.sem_R2L = CreateSemaphore (NULL, 1, managerS.n_R2L, NULL);
  managerS.sem_bridge = CreateSemaphore (NULL, 1, 1, NULL);

  managerH_L2R = CreateThread(NULL, 0, managerF_L2R, &managerS, 0, NULL);
  managerH_R2L = CreateThread(NULL, 0, managerF_R2L, &managerS, 0, NULL);

  WaitForSingleObject(managerH_L2R, INFINITE);
  WaitForSingleObject(managerH_R2L, INFINITE);

  _ftprintf(stdout, _T("Press enter to continue ...\n"));
  _gettchar();

  return 0;
}

/*
 *  Create 1 thread for each car running from left-to-right
 */
DWORD WINAPI managerF_L2R (LPVOID param) {
  manager_t *managerS;
  LPHANDLE threadsA;
  DWORD i;

  managerS = (manager_t *) param;
  threadsA = (LPHANDLE) malloc (managerS->n_L2R * sizeof(HANDLE));
  if (threadsA == NULL) {
      _ftprintf(stderr, _T("Memory allocation error: %x\n"), GetLastError());
      return 2;
  }

  for (i=0; i<managerS->n_L2R; i++) {
    threadsA[i] = CreateThread(NULL, 0, handlerF_L2R, managerS, 0, NULL);
    if (threadsA[i] == INVALID_HANDLE_VALUE) {
      _ftprintf(stderr, _T("Error thread creation:%x\n"), GetLastError());
      return 3;
    }
  }

  WaitForMultipleObjects (managerS->n_L2R, threadsA, TRUE, INFINITE);

  return (0);
}

/*
 *  Create 1 thread for each car running from left-to-right
 */
DWORD WINAPI managerF_R2L (LPVOID param) {
  manager_t *managerS;
  LPHANDLE threadsA;
  DWORD i;

  managerS = (manager_t *) param;
  threadsA = (LPHANDLE) malloc (managerS->n_R2L * sizeof(HANDLE));
  if (threadsA == NULL) {
    _ftprintf(stderr, _T("Memory allocation error: %x\n"), GetLastError());
    return 2;
  } 

  for (i = 0; i<managerS->n_R2L; i++) {
    threadsA[i] = CreateThread(NULL, 0, handlerF_R2L, managerS, 0, NULL);
    if (threadsA[i] == INVALID_HANDLE_VALUE) {
      _ftprintf(stderr, _T("Error thread creation:%x\n"), GetLastError());
      return 3;
    }
  }

  WaitForMultipleObjects (managerS->n_L2R, threadsA, TRUE, INFINITE);

  return (0);
}

/*
 * A single car from left-to-right
 */
DWORD WINAPI handlerF_L2R(LPVOID param) {
  manager_t *managerS;
  DWORD wait_time;
  DWORD id;

  managerS = (manager_t *)param;
  id = GetCurrentThreadId();
  srand(id);
  wait_time = (DWORD)(rand() % (managerS->time_A_L2R + 1));
  Sleep(wait_time * 1000);

  _ftprintf(stdout, _T("-> Car %u L-2-R started\n"), id);

  WaitForSingleObject(managerS->sem_L2R, INFINITE);
  managerS->passed_L2R++;
  if (managerS->passed_L2R == 1) {
    WaitForSingleObject(managerS->sem_bridge, INFINITE);
  }
  ReleaseSemaphore(managerS->sem_L2R, 1, NULL);

  _ftprintf(stdout, _T("--> Car %u L-2-R running\n"), id);

  Sleep(managerS->time_T_L2R * 1000);

  WaitForSingleObject(managerS->sem_L2R, INFINITE);
  managerS->passed_L2R--;
  if (managerS->passed_L2R == 0) {
    ReleaseSemaphore(managerS->sem_bridge, 1, NULL);
  }
  ReleaseSemaphore(managerS->sem_L2R, 1, NULL);

  _ftprintf(stdout, _T("---> Car %u L-2-R arrived\n"), id);

  return 0;
}

/*
 * A single car from right-to-left
 */
DWORD WINAPI handlerF_R2L (LPVOID param) {
  manager_t *managerS;
  DWORD wait_time, id;

  managerS = (manager_t *)param;
  id = GetCurrentThreadId();
  srand (id);
  wait_time = (DWORD)(rand() % (managerS->time_A_L2R + 1));
  Sleep (wait_time * 1000);

  _ftprintf(stdout, _T("<- Car %u R-2-L started\n"), id);

  WaitForSingleObject(managerS->sem_R2L, INFINITE);
  managerS->passed_R2L++;
  if (managerS->passed_R2L == 1) {
    WaitForSingleObject(managerS->sem_bridge, INFINITE);
  }
  ReleaseSemaphore(managerS->sem_R2L, 1, NULL);

  _ftprintf(stdout, _T("<-- Car %u R-2-L running\n"), id);

  Sleep(managerS->time_T_L2R * 1000);

  WaitForSingleObject(managerS->sem_R2L, INFINITE);
  managerS->passed_R2L--;
  if (managerS->passed_R2L == 0) {
    ReleaseSemaphore(managerS->sem_bridge, 1, NULL);
  }
  ReleaseSemaphore(managerS->sem_R2L, 1, NULL);

  _ftprintf(stdout, _T("<--- Car %u R-2-L arrived\n"), id);

  return 0;
}
