package com.example.superdefibank.ui.screens.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.superdefibank.model.User
import com.example.superdefibank.repository.DepositState
import com.example.superdefibank.ui.components.CustomButton
import com.example.superdefibank.ui.components.CustomTextField
import com.example.superdefibank.viewmodel.AuthViewModel
import com.example.superdefibank.viewmodel.BankViewModel
import com.walletconnect.sign.client.Sign
import kotlinx.coroutines.delay

@Composable
fun HomeScreen(
    authViewModel: AuthViewModel,
    bankViewModel: BankViewModel
) {
    val authUiState by authViewModel.authUiState.collectAsState()
    val depositState by bankViewModel.depositState.collectAsState()
    val user: User? = authUiState.user
    var message by remember { mutableStateOf("") }
    var error by remember { mutableStateOf("") }
    var depositAmount by remember { mutableStateOf("") }
    var withdrawAmount by remember { mutableStateOf("") }

    when(val state = depositState) {
        is DepositState.Pending -> {
            error = ""
            message = "Request has been sent on your wallet"
        }
        is DepositState.Success -> {
            error = ""
            message = "Deposit Successful"
            depositAmount = ""
        }
        is DepositState.Error -> {
            error = state.error.toString()
            message = ""
        }
        else -> {}
    }

    LaunchedEffect(message) {
        if (message.isNotEmpty()) {
            delay(3000)
            message = ""
        }
    }

    LaunchedEffect(error) {
        if (error.isNotEmpty()) {
            delay(3000)
            error = ""
        }
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Welcome, ${user?.name ?: "Guest"}",
            fontSize = 24.sp,
        )
        Spacer(modifier = Modifier.height(24.dp))
        Row() {
            Text(
                text = "Current Balance: ",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = user?.bankTokens.toString(),
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
        Spacer(modifier = Modifier.height(16.dp))
        Column (
            modifier = Modifier
                .padding(horizontal = 8.dp)
        ) {
            Row() {
                if (message.isNotEmpty()) {
                    Text(
                        text = message,
                        color = Color.Green
                    )
                }
                if (error.isNotEmpty()) {
                    Text(
                        text = error,
                        color = Color.Red
                    )
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Row() {
                CustomTextField(
                    value = depositAmount,
                    label = "Deposit Amount",
                    onValueChange = { depositAmount = it },
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                CustomButton(
                    label = "Deposit",
                    onClick = {
                        if (depositAmount.isEmpty()) {
                            error = "Please enter a deposit amount"
                            return@CustomButton
                        }
                        bankViewModel.deposit(depositAmount)
                    },
                    color = Color(0xFF4CAF50),
                    modifier = Modifier.width(100.dp)
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row() {
                CustomTextField(
                    value = "",
                    label = "Withdraw Amount",
                    onValueChange = {},
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                CustomButton(
                    label = "Withdraw",
                    onClick = {},
                    color = Color(0xfff44336),
                    modifier = Modifier.width(110.dp)
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row() {
                CustomButton(
                    label = "Get Balance",
                    onClick = {},
                    color = Color.Blue,
                    modifier = Modifier.fillMaxWidth()
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Deposited Balance: ",
                    color = Color.Gray
                )
                Text(
                    text = "0",
                    color = Color.Gray
                )
            }
        }
    }
}