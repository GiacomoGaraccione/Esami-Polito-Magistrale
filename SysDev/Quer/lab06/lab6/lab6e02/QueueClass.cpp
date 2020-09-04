//
//  QueueClass.hpp
//  lab6e1
//
//  Created by Enrico on 03/06/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#include "QueueClass.hpp"

template <typename T>
QueueClass<T>::QueueClass(const unsigned int &max_elements): _max_size(max_elements)
{
    this->_data_container = std::unique_ptr<T[]>(new T[max_elements]);
}

template <typename T>
QueueClass<T>::QueueClass(QueueClass<T>&& other) : _max_size(other._max_size), _size(other._size), _first(other._first), _data_container(std::move(other._data_container))
{
    other._max_size = 0;
    other._size = 0;
}

template <typename T>
QueueClass<T>::QueueClass(const QueueClass<T>& other): _max_size(other._max_size), _size(other._size), _first(other._first)
{
    this->_data_container.reset(new T[other._max_size]);
    for(auto i = 0; i < other._size; i++)
        this->_data_container[i] = other._data_container[other._first + i];

}

template <typename T>
QueueClass<T>::~QueueClass() {}

template <typename T>
QueueClass<T>& QueueClass<T>::operator=(const QueueClass<T>& other)
{
    if(this == &other)
        return *this;
    
    this->_data_container.reset(new T[other._max_size]);
    for(auto i = 0; i < other._size; i++)
        this->_data_container[i] = other._data_container[other._first + i];
    
    this->_size = other._size;
    this->_first = other._first;
    this->_max_size = other._max_size;
    return *this;
}

template <typename T>
QueueClass<T>& QueueClass<T>::operator=(QueueClass<T>&& other)
{
    if(this == &other)
        return *this;
        
    this->_size = other._size;
    this->_first = other._first;
    this->_max_size = other._max_size;
    this->_data_container = std::move(other._data_container);
    
    other._max_size = 0;
    other._size = 0;
    other._first = 0;
    
    return *this;
}

template <typename T>
QueueClass<T>& QueueClass<T>::operator+(const T& value) {
    this->enqueue(value);
    return *this;
}

template <typename T>
void QueueClass<T>::enqueue(const T &val)
{
    if(this->_size - this->_first + 1 > this->_max_size)
        this->resize(1 + this->_max_size * 2);

    this->_data_container[this->_size++] = val;
}

template <typename T>
T QueueClass<T>::top() const
{
    if(this->_size == 0)
        throw "Cannot top, the stack is empty";
    return this->_data_container[this->_first];
}

template <typename T>
T QueueClass<T>::last() const
{
    if(this->_size == 0)
        throw "Cannot top, the stack is empty";
    return this->_data_container[this->_first + this->_size - 1];
}

template <typename T>
T QueueClass<T>::dequeue()
{
    if(this->_size == 0)
        throw "Cannot dequeue, the stack is empty";
    
    auto return_value = this->_data_container[this->_first];
    this->_size--;
    this->_first = (this->_first + 1) % this->_max_size;

    return return_value;
}

template <typename T>
bool QueueClass<T>::empty() const {
    return this->_size == 0;
}

template <typename T>
void QueueClass<T>::clear()
{
    this->_size = 0;
}

template <typename T>
unsigned int QueueClass<T>::size() const {
    return this->_size;
}

template <typename T>
unsigned int QueueClass<T>::reserved_space() const {
    return this->_max_size;
}

template <typename T>
std::vector<T> QueueClass<T>::getStackAsVector()
{
    std::vector<T> result(this->_size);
    std::copy_n(this->_data_container.get(), this->_size, result.begin());
    return result;
}

template <typename T>
T* QueueClass<T>::data() const
{
    if(this->_size == 0)
        return nullptr;
    return this->_data_container.get();
}

template <typename T>
void QueueClass<T>::reverse()
{
    if(this->_size == 0)
        return;
    
    std::reverse(this->_data_container.get(), this->_data_container.get() + this->_size);
}

template <typename T>
void QueueClass<T>::resize(const unsigned int &new_max_size)
{
    std::unique_ptr<T[]> _new_data_container(new T[new_max_size]);
    for(auto i = 0; i < this->_size; i++)
        _new_data_container[i] = this->_data_container[this->_first + i];
    this->_data_container = std::move(_new_data_container);
    this->_first = 0;
    this->_max_size = new_max_size;
}

