//
//  QueueClass.hpp
//  lab6e1
//
//  Created by Enrico on 03/06/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#ifndef QueueClass_hpp
#define QueueClass_hpp

#define DEBUG 1

#include <vector>
#include <iostream>


template <typename T>
class QueueClass
{
public:
    QueueClass(const unsigned int &max_elements = 128);
    QueueClass(QueueClass<T>&& other);

    QueueClass(const QueueClass<T>& other);

    ~QueueClass();
    QueueClass<T>& operator=(const QueueClass<T>&);
    QueueClass<T>& operator=(QueueClass<T>&& other);
    QueueClass<T>& operator+(const T& value);
    friend std::istream& operator>>(std::istream &is, QueueClass<T> &stack)
    {
        unsigned int size, max_size;
#if DEBUG
        std::cout << "Insert stack size: ";
        is >> size;
        std::cout << "Insert stack max size: ";
        is >> max_size;
        
        stack.resize(stack.max_size);
        for(auto i = 0; i < size; i++) {
            T element;
            std::cout << "Insert stack[" << i << "]: ";
            is >> element;
            stack.enqueue(element);
        }
#else
        is >> size;
        is >> max_size;
        stack.resize(max_size);
        for(auto i = 0; i < size; i++) {
            T element;
            is >> element;
            stack.enqueue(element);
        }
#endif
        return is;
    }
    friend std::ostream& operator<<(std::ostream &os, const QueueClass<T> &stack)
    {
#if DEBUG
        std::cout << "Stack size: ";
        os << stack._size;
        std::cout << "Stack max size: ";
        os << stack._max_size;
        std::cout << std::endl << "Contents:" << std::endl;
        for(auto i = 0; i < stack._size; i++) {
            std::cout << "stack[" << i << "]: ";
            os << stack._data_container[i + stack._first];
            std::cout << std::endl;
        }
#else
        os << stack._size;
        os << stack._max_size;
        for(auto i = 0; i < stack._size; i++)
            os << stack._data_container[i + stack._first];
#endif
        return os;
    }
    void enqueue(const T &val);
    T top() const;
    T last() const;
    T dequeue();
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
    unsigned int _first = 0;
    std::unique_ptr<T[]> _data_container;
    
};

#endif /* QueueClass_hpp */
