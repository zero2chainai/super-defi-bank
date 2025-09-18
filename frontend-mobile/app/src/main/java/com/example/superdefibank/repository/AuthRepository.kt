package com.example.superdefibank.repository

import com.example.superdefibank.api.ApiClient
import com.example.superdefibank.model.ApiResponse
import com.example.superdefibank.model.LoginRequest
import com.example.superdefibank.model.RegisterRequest
import com.example.superdefibank.model.User
import retrofit2.Response

class AuthRepository {

    private val api = ApiClient.apiService

    suspend fun register(name: String, walletAddress: String): Response<ApiResponse<User>> {
        return api.register(RegisterRequest(name, walletAddress))
    }

    suspend fun login(walletAddress: String): Response<ApiResponse<User>> {
        return api.login(LoginRequest(walletAddress))
    }
}

