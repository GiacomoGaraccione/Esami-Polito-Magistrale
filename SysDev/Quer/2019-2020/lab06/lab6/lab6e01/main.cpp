//
//  main.cpp
//  lab6e1
//
//  Created by Enrico on 03/06/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#include <iostream>
#include "StackClass.cpp"

int main(int argc, const char * argv[]) {
    

    StackClass<int> stack1(3);
    stack1.push(1);
    stack1.push(2);
    stack1.push(3);
    printf("top: %d, size: %d, reserved space: %d\n", stack1.top(), stack1.size(), stack1.reserved_space());
    stack1.push(4);
    printf("top: %d, size: %d, reserved space: %d\n", stack1.top(), stack1.size(), stack1.reserved_space());
    stack1.push(5);
    stack1.push(6);
    stack1.push(7);
    stack1.push(8);
    int value = stack1.pop();
    printf("pop: %d, top: %d, size: %d, reserved space: %d\n", value, stack1.top(), stack1.size(), stack1.reserved_space());
    
    stack1.push(9);
    std::vector<int> vec = stack1.getStackAsVector();
    for(auto e: vec)
        std::cout << e << std::endl;
    stack1.reverse();
    printf("top: %d, size: %d, reserved space: %d\n", stack1.top(), stack1.size(), stack1.reserved_space());

    vec = stack1.getStackAsVector();
    
    for(auto e: vec)
        std::cout << e << std::endl;

    StackClass<int> stack2(stack1);
    printf("1: top: %d, size: %d, reserved space: %d\n", stack1.top(), stack1.size(), stack1.reserved_space());
    printf("2: top: %d, size: %d, reserved space: %d\n", stack2.top(), stack2.size(), stack2.reserved_space());
    
    StackClass<int> stack3(std::move(stack1));
    printf("3: top: %d, size: %d, reserved space: %d\n", stack3.top(), stack3.size(), stack3.reserved_space());
  
    StackClass<int> stack4(stack3);
//    std::cin >> stack4;
    
    printf("4: top: %d, size: %d, reserved space: %d\n", stack4.top(), stack4.size(), stack4.reserved_space());
    stack2.push(3);
    std::cout << stack4;
    
    stack4 = stack4 + 1;
    
    std::cout << stack4;
    
    return 0;
}
