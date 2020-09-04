//
//  main.cpp
//  lab6e1
//
//  Created by Enrico on 03/06/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#include <iostream>
#include <chrono>
#include <thread>
#include "QueueClass.cpp"

typedef enum { Priority, PostServices, MoneyServices} ClientType;

typedef struct {
    unsigned int id;
    ClientType type;
} Client;

void printMenu() {
    std::cout << "Select an option:" << std::endl;
    std::cout << "1. Request a new number" << std::endl;
    std::cout << "2. Serve next client" << std::endl;
    std::cout << "3. Serve all and close" << std::endl;
}

void newNumber(QueueClass<Client> &priority, QueueClass<Client> &postal, QueueClass<Client> &money, unsigned int &id) {
    unsigned int client;
    std::cout << "Select client type: " << std::endl;
    std::cout << "1. Priority" << std::endl;
    std::cout << "2. Postal" << std::endl;
    std::cout << "3. Money" << std::endl;
    std::cin >> client;
    switch (client) {
        case 1:
            priority.enqueue({id++, Priority});
            std::cout << "e id: " << priority.last().id << " type: " << priority.last().type << std::endl;
            break;
        case 2:
            postal.enqueue({id++, PostServices});
            std::cout << "e id: " << postal.last().id << " type: " << postal.last().type << std::endl;
            break;
        case 3:
            money.enqueue({id++, MoneyServices});
            std::cout << "e id: " << money.last().id << " type: " << money.last().type << std::endl;
            break;
    }
}

void serveNextClient(QueueClass<Client> &priority, QueueClass<Client> &postal, QueueClass<Client> &money, unsigned int &served_money) {

    if(!priority.empty()) {
        Client c = priority.dequeue();
        std::cout << "d id: " << c.id << " type: " << c.type << std::endl;
    } else if(money.empty() && !postal.empty()) {
        Client c = postal.dequeue();
        std::cout << "d id: " << c.id << " type: " << c.type << std::endl;
    } else if (!money.empty()){
        if(!postal.empty() && served_money == 3) {
            Client c = postal.dequeue();
            std::cout << "d id: " << c.id << " type: " << c.type << std::endl;
            served_money = 0;
        } else {
            Client c = money.dequeue();
            std::cout << "d id: " << c.id << " type: " << c.type << std::endl;
            served_money++;
        }
    } else {
        std::cout << "No more clients" << std::endl;
    }
}

int main(int argc, const char * argv[]) {
    unsigned int id = 0;
    int option;
    unsigned int served_money = 0;
    QueueClass<Client> priority;
    QueueClass<Client> postal;
    QueueClass<Client> money;
    std::chrono::milliseconds timespan(800);
    
    do {
        printMenu();
      
        std::cin >> option;
        switch (option) {
            case 1:
                newNumber(priority, postal, money, id);
                break;
            case 2:
                serveNextClient(priority, postal, money, served_money);
                break;
            case 3:
                while(!priority.empty() || !postal.empty() || !money.empty()){
                    serveNextClient(priority, postal, money, served_money);
                    std::this_thread::sleep_for(timespan);
                }
                break;
            default:
                std::cout << "Error, please insert again your choice" << std::endl;
                break;
        }
    } while (option != 3);
    
    
    return 0;
}
