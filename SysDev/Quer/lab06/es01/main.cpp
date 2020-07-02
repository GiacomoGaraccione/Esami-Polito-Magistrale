#include <iostream>


template <typename T>
class StackClass
{
	public:
		StackClass(const int& max_elements = 1024) {
			_max_elements = max_elements;
			_data_container = (T*)malloc(1 * sizeof(T));
			lastPos = 0;
		}
		~StackClass() {

		}
		
		int getME() {
			return _max_elements;
		}

		void push(const T val) {
			_data_container[lastPos] = val;
			lastPos++;
			_data_container = (T*)realloc(_data_container, (lastPos + 1) * sizeof(T));
		}

		T pop() {
			lastPos--;
			T val = _data_container[lastPos];
			_data_container = (T*)realloc(_data_container, (lastPos + 1) * sizeof(T));
			return val;
		}

		void print() {
			int i;
			for (i = 0; i < lastPos; i++) {
				std::cout << _data_container[i];
				std::cout << std::endl;
			}
		}

		int size() {
			return lastPos;
		}

private:
	int _max_elements;
	int lastPos;
	T* _data_container;
};



int main() {

	StackClass<int> sc = StackClass<int>(66);
	int me = sc.getME();
	sc.push(10);
	sc.push(4);


	int res = sc.size();

	//std::cout << me;

	std::cout << res;
	return 0;
}