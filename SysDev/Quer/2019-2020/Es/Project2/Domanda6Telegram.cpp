#include <iostream>
#include <mutex>
#include <queue>
#include <thread>

using namespace std;

void producer(int n);
void consumer();
void prodFunc();
void consFunc();

queue<int> Q;
bool done = false;
mutex mut, vuoto;

int main() {
	thread prod, cons;
	prod = thread(prodFunc);
	cons = thread(consFunc);

	prod.join();
	cons.join();
	return 0;
}

void producer(int n) {
	mut.lock();
	for (int i = 0; i < n; i++) {
		cout << "Producing " << i << endl;
		Q.push(i);
	}
	mut.unlock();
	done = true;
}

void consumer() {
	while (!done) {
		mut.lock();
		while (!Q.empty()) {
			cout << "Consuming " << Q.front() << endl;
			Q.pop();
		}
		mut.unlock();
	}
}

void prodFunc() {

	producer(20);
}

void consFunc() {
	
	consumer();
	
}