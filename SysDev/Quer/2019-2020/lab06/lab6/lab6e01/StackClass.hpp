//
//  StackClass.hpp
//  lab6e1
//
//  Created by Enrico on 03/06/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#ifndef StackClass_hpp
#define StackClass_hpp

#define DEBUG 1

#include <vector>
#include <iostream>


template <typename T>
class StackClass
{
public:
    StackClass(const unsigned int &max_elements = 128);
    StackClass(StackClass<T>&& other);

    StackClass(const StackClass<T>& other);

    ~StackClass();
    StackClass<T>& operator=(const StackClass<T>&);
    StackClass<T>& operator=(StackClass<T>&& other);
    StackClass<T>& operator+(const StackClass<T>& other);
    StackClass<T>& operator+(const T& value);
    friend std::istream& operator>>(std::istream &is, StackClass<T> &stack)
    {
        unsigned int size;
#if DEBUG
        std::cout << "Insert stack size: ";
        is >> size;
        stack.resize(size);
        for(auto i = 0; i < size; i++) {
            T element;
            std::cout << "Insert stack[" << i << "]: ";
            is >> element;
            stack.push(element);
        }
#else
        is >> size;
        stack.resize(size);
        for(auto i = 0; i < size; i++) {
            T element;
            is >> element;
            stack.push(element);
        }
#endif
        return is;
    }
    friend std::ostream& operator<<(std::ostream &os, const StackClass<T> &stack)
    {
#if DEBUG
        std::cout << "Stack size: ";
        os << stack._size;
        std::cout << std::endl << "Contents:" << std::endl;
        for(auto i = 0; i < stack._size; i++) {
            std::cout << "stack[" << i << "]: ";
            os << stack._data_container[i];
            std::cout << std::endl;
        }
#else
        os << stack._size;
        for(auto i = 0; i < stack._size; i++)
            os << stack._data_container[i];
#endif
        return os;
    }
    void push(const T &val);
    T top() const;
    T pop();
    bool empty() const;
    void clear();
    unsigned int size() const;
    unsigned int reserved_space() const;
    std::vector<T> getStackAsVector();
    T* data() const;
    void reverse();
    
private:
    void resize(const unsigned int &new_max_size);
    unsigned int _max_size;
    unsigned int _size = 0;
    T * _data_container;
    
};

#endif /* StackClass_hpp */
