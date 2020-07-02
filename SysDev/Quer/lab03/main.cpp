#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#include <windows.h>
#include <tchar.h>

#define TYPE_FILE 1
#define TYPE_DIR 2
#define TYPE_DOT 3

BOOL createNewDirectory(LPCTSTR lpPath);
void traverse_directory(LPCTSTR lpSearchFile);
DWORD fileType(WIN32_FIND_DATA data);
BOOL myCopyFile(LPCTSTR src, LPCTSTR dest);

int _tmain(int argc, LPTSTR argv[]) {
	if (argc != 3) {
		_tprintf(_T("error in number of arguments\n"));
		return -1;
	}

	_tprintf(_T("arguments:\n%s, %s\n"), argv[1], argv[2]);

	//traverse_directory(argv[1]);

	myCopyFile(argv[1], argv[2]);

	return 0;
}

BOOL myCopyFile(LPCTSTR src, LPCTSTR dest) {
	HANDLE hIn;
	HANDLE hOut;
	TCHAR c;
	DWORD bytesRead, nOut;

	hIn = CreateFile(src, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	hOut = CreateFile(dest, GENERIC_WRITE, FILE_SHARE_READ, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);

	if (hIn == INVALID_HANDLE_VALUE || hOut == INVALID_HANDLE_VALUE) {
		return false;
	}

	while (ReadFile(hIn, &c, sizeof(c), &bytesRead, NULL) && bytesRead != 0) {
		WriteFile(hOut, &c, sizeof(c), &nOut, NULL);
	}

	CloseHandle(hIn);
	CloseHandle(hOut);

	return true;
}

DWORD fileType(WIN32_FIND_DATA data) {
	BOOL isDir;
	isDir = (data.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) != 0;

	if (isDir) {
		if (lstrcmp(data.cFileName, _T(".")) == 0 || lstrcmp(data.cFileName, _T("..")) == 0) {
			return TYPE_DOT;
		}
		else {
			return TYPE_DIR;
		}
	}
	return TYPE_FILE;
}

//lpSearchFile e' la directory da cercare (in realta' e' un path con wildcars, es '*' e '?'...)
void traverse_directory(LPCTSTR lpSearchFile) {
	WIN32_FIND_DATA data;
	HANDLE searchHandle;
	DWORD file_type;

	SetCurrentDirectory(lpSearchFile);

	searchHandle = FindFirstFile(_T("*"), &data);

	do {
		file_type = fileType(data);
		if (file_type == TYPE_FILE) {
			_tprintf(_T("FILE: %s\n"), data.cFileName);
		}
		else if (file_type == TYPE_DIR) {
			_tprintf(_T("DIR: %s\n"), data.cFileName);
			_tprintf(_T("now traversing DIR: %s\n"), data.cFileName);
			traverse_directory(data.cFileName);
		}
		else {
			_tprintf(_T("DOT: %s\n"), data.cFileName);
		}
	} while (FindNextFile(searchHandle, &data));

	SetCurrentDirectory(_T(".."));

	FindClose(searchHandle);
}

//lpPath e' il path, relativo o assoluto, della nuova dir da creare
//se la dir c'e' gia' da errore
BOOL createNewDirectory(LPCTSTR lpPath) {
	if (CreateDirectory(lpPath, NULL)) {
		_tprintf(_T("new directory created: %s\n"), lpPath);
		return true;
	}
	_tprintf(_T("error: could not create new directory: %s\n"), lpPath);
	return false;
}