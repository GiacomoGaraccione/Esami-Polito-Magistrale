#define UNICODE
#define _UNICODE

#define _CRT_SECURE_NO_WARNINGS

#define TYPE_FILE 1
#define TYPE_DIR 2
#define TYPE_DOT 3

#include <windows.h>
#include <tchar.h>

struct data {
	DWORD i;
	LPCTSTR dirPath;
	LPCTSTR filePath;
};

void traverse_directory(LPCTSTR path);
DWORD fileType(WIN32_FIND_DATA data);

int _tmain(int argc, LPTSTR argv[]) {

	struct data *d = (struct data *)malloc((argc - 1) * sizeof(struct data));
	int i;
	char str[10] = "sdsd";

	for (i = 0; i < argc - 1; i++) {
		d[i].i = i;
		d[i].dirPath = argv[i+1];
		strcat(str, "1");
		_tprintf(_T("%s\n"), str);
	}

	//traverse_directory(argv[1]);

	return 0;
}

void traverse_directory(LPCTSTR path) {
	HANDLE h;
	WIN32_FIND_DATA data;
	DWORD file_type;

	SetCurrentDirectory(path);

	h = FindFirstFile(_T("*"), &data);

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
	} while (FindNextFile(h, &data));

	SetCurrentDirectory(_T(".."));

	FindClose(h);
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