//
//  StackClass.hpp
//  lab6e1
//
//  Created by Enrico on 03/06/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#include "StackClass.hpp"

template <typename T>
StackClass<T>::StackClass(const unsigned int &max_elements): _max_size(max_elements)
{
    this->_data_container = new T[max_elements];
}

template <typename T>
StackClass<T>::StackClass(StackClass<T>&& other) : _max_size(other._max_size), _size(other._size), _data_container(other._data_container)
{
    other._max_size = 0;
    other._size = 0;
    other._data_container = nullptr;
}

template <typename T>
StackClass<T>::StackClass(const StackClass<T>& other): _max_size(other._max_size), _size(other._size)
{
    this->_data_container = new T[other._max_size];
    std::copy_n(other._data_container, other._size, this->_data_container);
}

template <typename T>
StackClass<T>::~StackClass()
{
    if(this->_data_container)
        delete[] this->_data_container;
}

template <typename T>
StackClass<T>& StackClass<T>::operator=(const StackClass<T>& other)
{
    if(this == &other)
        return *this;
    
    this->resize(other._max_size);
    std::copy_n(other._data_container, other._size, this->_data_container);
    this->_size = other._size;
    this->_max_size = other._max_size;
    return *this;
}

template <typename T>
StackClass<T>& StackClass<T>::operator=(StackClass<T>&& other)
{
    if(this == &other)
        return *this;
    if(this->_data_container)
        delete[] this->_data_container;
    
    this->_size = other._size;
    this->_max_size = other._max_size;
    this->_data_container = other._data_container;
    
    other._max_size = 0;
    other._size = 0;
    other._data_container = nullptr;
    
    return *this;
}

template <typename T>
StackClass<T>& StackClass<T>::operator+(const StackClass<T>& other)
{
    if(other.empty())
        return *this;
    for(auto i = 0; i < other._size; i++)
        this->push(other._data_container[i]);
    return *this;
}
template <typename T>
StackClass<T>& StackClass<T>::operator+(const T& value) {
    this->push(value);
    return *this;
}

template <typename T>
void StackClass<T>::push(const T &val)
{
    if(this->_size + 1 > this->_max_size)
        this->resize(1 + this->_max_size * 2);
    this->_data_container[this->_size++] = val;
}

template <typename T>
T StackClass<T>::top() const
{
    if(this->_size == 0)
        throw "Cannot top, the stack is empty";
    return this->_data_container[this->_size - 1];
}

template <typename T>
T StackClass<T>::pop()
{
    if(this->_size == 0)
        throw "Cannot pop, the stack is empty";
    return this->_data_container[--this->_size];
}

template <typename T>
bool StackClass<T>::empty() const {
    return this->_size == 0;
}

template <typename T>
void StackClass<T>::clear()
{
    this->_size = 0;
}

template <typename T>
unsigned int StackClass<T>::size() const {
    return this->_size;
}

template <typename T>
unsigned int StackClass<T>::reserved_space() const {
    return this->_max_size;
}

template <typename T>
std::vector<T> StackClass<T>::getStackAsVector()
{
    std::vector<T> result(this->_size);
    std::reverse_copy(this->_data_container, this->_data_container + this->_size, result.begin());
    return result;
}

template <typename T>
T* StackClass<T>::data() const
{
    if(this->_size == 0)
        return nullptr;
    return this->_data_container;
}

template <typename T>
void StackClass<T>::reverse()
{
    if(this->_size == 0)
        return;
    
    std::reverse(this->_data_container, this->_data_container + this->_size);
}

template <typename T>
void StackClass<T>::resize(const unsigned int &new_max_size)
{
    auto _new_data_container = new T[new_max_size];
    std::copy_n(this->_data_container, this->_size, _new_data_container);
    if(this->_data_container)
        delete[] this->_data_container;
    this->_data_container = _new_data_container;
    this->_max_size = new_max_size;
}

