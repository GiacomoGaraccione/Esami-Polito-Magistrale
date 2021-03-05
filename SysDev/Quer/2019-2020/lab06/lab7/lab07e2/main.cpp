//
//  main.cpp
//  lab07e2
//
//  Created by Enrico on 04/07/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#include <iostream>
#include <map>
#include <string>
#include <chrono>
#include <thread>
#include <mutex>
#include <vector>
#include <fstream>

#define BUF_SIZE 16

std::mutex buffer_mux;
std::vector<int> buffer(BUF_SIZE);
int start = 0, size = 0;
std::ofstream output;
 
void producer(void)
{
    int last_value = 0;
    while(last_value < 1001) {
        buffer_mux.lock();
        if(size < buffer.size()) {
            std::cout << "producing: " << last_value << std::endl;
            
            buffer[(start + size++) % BUF_SIZE] = last_value == 1000 ? -1 : last_value;
            last_value++;
        }
        
        buffer_mux.unlock();
    }
}

void consumer(void) {
    int last_read = 0;
    while(last_read != -1) {
        buffer_mux.lock();
        if(size > 0) {
            last_read = buffer[start % BUF_SIZE];
            if(last_read != -1) {
                start++;
                size--;
                output << last_read << std::endl;
            }
            std::cout << std::this_thread::get_id() <<") consuming: " << last_read << std::endl;
        }
        buffer_mux.unlock();
    }
}
 
int main(int argc, const char * argv[]) {
    output.open("out.txt");
    std::thread prod(producer);
    std::vector<std::thread> consumers;

   
    for(auto i = 0; i < std::thread::hardware_concurrency(); i++)
        consumers.emplace_back(std::thread(consumer));
    
    
    prod.join();
    
    for(unsigned long i = 0; i < consumers.size(); i++) {
        consumers.at(i).join();
    }
    
   
    output.close();
    
    return 0;
}
