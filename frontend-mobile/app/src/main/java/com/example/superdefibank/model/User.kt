package com.example.superdefibank.model

import java.time.Instant

data class User(
    val _id: String,
    val name: String,
    val walletAddress: String,
    val bankTokens: Double,
    val depositedTokens: Double,
    val createdAt: String
)