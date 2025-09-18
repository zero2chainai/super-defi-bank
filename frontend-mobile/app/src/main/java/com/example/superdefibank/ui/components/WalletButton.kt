package com.example.superdefibank.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import com.example.superdefibank.viewmodel.WalletState
import com.example.superdefibank.viewmodel.WalletViewModel

@Composable
fun WalletButton(
    walletViewModel: WalletViewModel
) {
    var qrUri by remember { mutableStateOf<String?>(null) }
    val walletUiState by walletViewModel.walletUiState.collectAsState()
    var btnText = "Connect Wallet"

    when(walletUiState.state) {
        WalletState.Connecting -> { btnText = "Scan QR Code"}
        WalletState.Connected -> { btnText = "Disconnect Wallet" }
        WalletState.Disconnecting -> { btnText = "Disconnecting" }
        WalletState.Disconnected -> { btnText = "Connect Wallet" }
        else -> {}
    }

    Text(
        text = btnText,
        color = Color.Blue,
        textDecoration = TextDecoration.Underline,
        modifier = Modifier.clickable {
            if (walletUiState.state == WalletState.Idle) {
                walletViewModel.connectWallet{ uri -> qrUri = uri }
            }
        }
    )

    if (walletUiState.walletAddress == null) {
        qrUri?.let { uri ->
            ShowQRCode(uri)
        }
    }
}