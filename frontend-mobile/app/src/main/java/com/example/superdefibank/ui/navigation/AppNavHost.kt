package com.example.superdefibank.ui.navigation

import androidx.compose.runtime.Composable
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.superdefibank.ui.screens.home.HomeScreen
import com.example.superdefibank.ui.screens.login.LoginScreen
import com.example.superdefibank.ui.screens.register.RegisterScreen
import com.example.superdefibank.viewmodel.AuthViewModel
import com.example.superdefibank.viewmodel.WalletViewModel

@Composable
fun AppNavHost() {
    val navHostController = rememberNavController()
    val walletViewModel: WalletViewModel = hiltViewModel()
    val authViewModel: AuthViewModel = hiltViewModel()

    NavHost(navController = navHostController, startDestination = Routes.Login.route) {
        composable(Routes.Home.route) {
            HomeScreen()
        }
        composable(Routes.Login.route) {
            LoginScreen(navHostController, walletViewModel, authViewModel)
        }
        composable(Routes.Register.route) {
            RegisterScreen(navHostController, walletViewModel, authViewModel)
        }
    }
}