//
//  main.cpp
//  lab07e3
//
//  Created by Enrico on 04/07/2020.
//  Copyright © 2020 Enrico. All rights reserved.
//

#include <iostream>
#include <vector>
#include <future>
#include <algorithm>
#include <chrono>
#include <random>


std::vector<std::vector<int>> matrix_mul(std::vector<std::vector<int>>& A, std::vector<std::vector<int>>& B) {
    
    unsigned long An, Am, Bn, Bm;
//  A = m x n
    if(A.size() <= 0 || B.size() <= 0)
        throw "Not right";
    An = A[0].size();
    Am = A.size();
    Bn = B[0].size();
    Bm = B.size();
    
    if(An != Bm)
        throw "Not right";
    
    std::vector<std::vector<int>> C(Am, std::vector<int>(Bn));
    std::vector<std::future<void>> tasks;
    
    auto compute_element = [&C, &A, &B](unsigned long i, unsigned long j)
    {
       int res = 0;
        for(auto x = 0; x < A[i].size(); x++)
            res += A[i][x] * B[x][j];
       
        C[i][j] = res;
    };
    
    for(unsigned long i = 0; i < Am; i++) {
        for(unsigned long j = 0; j < Bn; j++) {
            tasks.emplace_back(std::async(std::launch::async, compute_element, i, j));
        }
    }
    
    for(auto& task: tasks)
        task.get();
    
    
    return C;
}

void random_populate_mat(std::vector<std::vector<int>>& mat, std::mt19937& generator, std::uniform_int_distribution<int>& distr){
    for(auto i = 0; i < mat.size(); i++)
        for(auto j = 0; j < mat[0].size(); j++)
            mat[i][j]= distr(generator);
    
}

void print_mat(std::vector<std::vector<int>>& mat) {
    for(auto i = 0; i < mat.size(); i++){
        for(auto j = 0; j < mat[0].size(); j++)
            std::cout << mat[i][j] << "\t";
        std::cout << std::endl;
    }
}

int main(int argc, const char * argv[]) {
    const int range_from  = 3;
    const int range_to    = 8;
    std::random_device rand_dev;
    std::mt19937 generator(rand_dev());
    std::uniform_int_distribution<int> distr(range_from, range_to);

    int An = distr(generator);
    int Am = distr(generator);
    int Bn = distr(generator);
    int Bm = An;
    
    std::vector<std::vector<int>> A(Am, std::vector<int>(An));
    random_populate_mat(A, generator, distr);
    print_mat(A);
   // std::cout << std::endl;
    
    std::vector<std::vector<int>>  B(Bm, std::vector<int>(Bn));
    random_populate_mat(B, generator, distr);
    print_mat(B);
  //  std::cout << std::endl;
    std::vector<std::vector<int>> C = matrix_mul(A, B);
    print_mat(C);
    return 0;
}
