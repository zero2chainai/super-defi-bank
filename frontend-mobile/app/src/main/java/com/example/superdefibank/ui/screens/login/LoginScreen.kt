package com.example.superdefibank.ui.screens.login

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.superdefibank.ui.components.WalletButton
import com.example.superdefibank.ui.navigation.Routes
import com.example.superdefibank.viewmodel.AuthState
import com.example.superdefibank.viewmodel.AuthViewModel
import com.example.superdefibank.viewmodel.WalletState
import com.example.superdefibank.viewmodel.WalletViewModel

@Composable
fun LoginScreen(
    navHostController: NavHostController,
    walletViewModel: WalletViewModel,
    authViewModel: AuthViewModel
) {
    val authUiState by authViewModel.authUiState.collectAsState()
    val walletUiState by walletViewModel.walletUiState.collectAsState()
    var error by remember { mutableStateOf("") }

    when (authUiState.state) {
        is AuthState.success -> {
            navHostController.navigate(Routes.Home.route) {
                popUpTo(Routes.Login.route) { inclusive = true }
            }
        }
        is AuthState.Error -> {
            error = (authUiState.state as AuthState.Error).message
        }
        else -> {}
    }

    when (walletUiState.state) {
        WalletState.Connected -> {
            error = ""
        }
        else -> {}
    }

    Column(
        modifier = Modifier
            .fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Login",
            fontSize = 24.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        WalletButton(walletViewModel)
        Spacer(modifier = Modifier.height(16.dp))
        Row {
            Text(
                text = "Don't have an account?",
                color = Color.Gray
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "Register",
                textDecoration = TextDecoration.Underline,
                color = Color.Blue,
                modifier = Modifier.clickable { navHostController.navigate(Routes.Register.route) }
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Button(
            onClick = {
                walletUiState.walletAddress?.let {
                    authViewModel.login(it)
                } ?: run {
                    error = "Please connect your wallet first"
                }
            },
        ) {
            Text(text = "Login")
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = error,
            color = Color.Red
        )
    }
}