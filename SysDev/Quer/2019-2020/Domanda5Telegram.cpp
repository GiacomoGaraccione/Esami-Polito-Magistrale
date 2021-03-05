#include <iostream>
#include <thread>
#include <mutex>
#include <shared_mutex>
#include <string>
#include <fstream>
#define N 4
#define M 3
using namespace std;

shared_mutex mut;
int vett[1000];

void readerFunc();
void writerFunc();

int main() {
	int i;
	ofstream file;
	ifstream fileR;
	file.open("NumFile.txt");
	fileR.open("NumFile.txt");
	thread reader;
	thread writer;
		reader = thread(readerFunc);
	
		writer = thread(writerFunc);

	
		reader.join();

		writer.join();
	return 0;
}

void readerFunc() {
	int i = 0;
	
	while (i < 1000) {
		mut.lock();
		vett[i] = i;
		mut.unlock();
		i++;
	}
}

void writerFunc() {
	int i = 0;
	string line;
	while (i < 1000) {
		mut.lock_shared();
		
			cout << vett[i] << endl;
		
		mut.unlock_shared();
		i++;
	}
}