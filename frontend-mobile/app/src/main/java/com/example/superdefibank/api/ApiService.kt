package com.example.superdefibank.api

import com.example.superdefibank.model.ApiResponse
import com.example.superdefibank.model.LoginRequest
import com.example.superdefibank.model.RegisterRequest
import com.example.superdefibank.model.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("users/register")
    suspend fun register(@Body body: RegisterRequest): Response<ApiResponse<User>>

    @POST("users/login")
    suspend fun login(@Body body: LoginRequest): Response<ApiResponse<User>>
}