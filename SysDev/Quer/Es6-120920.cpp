#include <iostream>
#include <functional>
#include <thread>
#include <future>

/*
 - Codice per organizzare una catena di async tasks eseguiti in ordine (il primo manda il segnale al secondo che manda il segnale al terzo...)
*/
using namespace std;

#define N 5

/*
 - Setta il valore del secondo task, può andare subito senza aspettare
*/
void first(promise<int> &nextTask) {
	cout << "First task done" << endl;
	nextTask.set_value(2);
	return;
}

/*
 - Aspetta il valore del task precedente (bloccato da currentTask.get() ) e setta il valore del task successivo
*/
void inner(future<int> &currentTask, promise<int> &nextTask) {
	int val = currentTask.get();
	cout << "Task number " << val << " done" << endl;
	nextTask.set_value(val + 1);
	return;
}

/*
 - Aspetta il valore del penultimo task
*/
void last(future<int> &currentTask) {
	int val = currentTask.get();
	cout << "Final task done" << endl;
	return;
}

int main() {
	promise<int> promises[N];
	future<int> futures[N];
	future<void> tasks[N];
	for (int i = 0; i < N; i++) {
		futures[i] = promises[i].get_future();
		if (i == 0) {
			tasks[i] = async(launch::async | launch::deferred, first, ref(promises[i]));
		}
		else if (i != (N - 1)) {
			tasks[i] = async(launch::async | launch::deferred, inner, ref(futures[i - 1]), ref(promises[i]));
		}
		else {
			tasks[i] = async(launch::async | launch::deferred, last, ref(futures[i - 1]));
		}
	}
}