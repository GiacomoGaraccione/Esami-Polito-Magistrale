#include <iostream>
#include <thread>
#include <ctime>
#include <mutex>
#include <condition_variable>

using namespace std;

/*
 - Riempie un vettore di valori 0-2 e lancia tre thread per contare il numero di ripetizioni di ciascun numero
 - I tre thread di controllo partono solo quando il vettore è pronto ma sono generati tutti insieme (partenza controllata da condition_variable)
*/

#define N 10

int charsGenerated = 0;
int vett[N];
mutex m;
condition_variable arrayDone;

void generateChar(int i) {
	vett[i] = (rand() % 3);
	unique_lock<mutex> lock{ m };
	charsGenerated++;
	if (charsGenerated == N) {
		arrayDone.notify_all();
		cout << "Array prepared, other threads can go" << endl;
	}
	lock.unlock();
}

void countDigit() {
	int digits = 0;
	unique_lock<mutex> lock{ m };
	if (charsGenerated < N) {
		arrayDone.wait(lock);
	}
	for (int i = 0; i < N; i++) {
		if (vett[i] == 0)
			digits++;
	}
	cout << "Number of digits in array: " << digits << endl;
}

void countPunct() {
	int puncts = 0;
	unique_lock<mutex> lock{ m };
	if (charsGenerated < N) {
		arrayDone.wait(lock);
	}
	for (int i = 0; i < N; i++) {
		if (vett[i] == 1)
			puncts++;
	}
	cout << "Number of punctuation signs in array: " << puncts << endl;
}

void countLetter() {
	int letters = 0;
	unique_lock<mutex> lock{ m };
	if (charsGenerated < N) {
		arrayDone.wait(lock);
	}
	for (int i = 0; i < N; i++) {
		if (vett[i] == 2)
			letters++;
	}
	cout << "Number of letters in array: " << letters << endl;
}

int main() {
	srand(time(NULL));
	thread vettThreads[N];
	thread threadDigit;
	thread threadPunct;
	thread threadLetter;
	for (int i = 0; i < N; i++) {
		vettThreads[i] = thread(generateChar, i);
	}
	threadDigit = thread(countDigit);
	threadPunct = thread(countPunct);
	threadLetter = thread(countLetter);

	for (int i = 0; i < N; i++) {
		vettThreads[i].join();
	}
	threadDigit.join();
	threadPunct.join();
	threadLetter.join();
	return 0;
}