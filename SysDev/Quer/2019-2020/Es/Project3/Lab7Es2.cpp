#include <iostream>
#include <thread>
#include <mutex>
#include <future>


using namespace std;

void prodFunc(future<int> & fut);
void consFunc(future<int> & fut);

int buffer[16];
mutex mut;
bool done = false;

int main() {
	
	int i;
	thread prod;//, cons[5181565];
	thread cons;
	promise<int> prom;
	future<int> fut = prom.get_future();
	prod = thread(prodFunc, ref(fut));
	/*for (i = 0; i < 5181565; i++) {
		cons[i] = thread(consFunc);
	}*/
	cons = thread(consFunc, ref(fut));
	prod.join();
	prom.set_value(1);
	/*for (i = 0; i < 5181565; i++) {
		cons[i].join();
	}*/
	cons.join();
	return 0;
}

void prodFunc(future<int>& fut) {
	int i;
	
	for (i = 0; i < 1000; i++) {
		buffer[i % 16] = i;
	}
	buffer[i % 16] = -1;
	
	done = true;
}

void consFunc(future<int>& fut) {
	int i = fut.get();
	if (i == 1) {
		
		for (i = 0; i < 1000; i++) {
			cout << buffer[i % 16] << endl;
		}
		
	}
}