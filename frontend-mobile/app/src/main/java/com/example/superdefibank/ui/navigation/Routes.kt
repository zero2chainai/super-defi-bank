package com.example.superdefibank.ui.navigation

sealed class Routes(val route: String) {
    object Home : Routes("home")
    object Login : Routes("login")
    object Register: Routes("register")
}