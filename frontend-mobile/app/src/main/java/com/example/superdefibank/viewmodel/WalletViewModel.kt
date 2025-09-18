package com.example.superdefibank.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.superdefibank.repository.WalletRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class WalletViewModel @Inject constructor(
    private val walletRepository: WalletRepository
): ViewModel() {
    private val _walletUiState = MutableStateFlow(WalletUiState())
    val walletUiState: StateFlow<WalletUiState> = _walletUiState

    init {
        walletRepository.registerCallback()
        walletRepository.walletAddress.observeForever { address ->
            _walletUiState.value = _walletUiState.value.copy(
                state = if (address != null) WalletState.Connected else WalletState.Disconnected,
                walletAddress = address
            )
        }
    }

    fun connectWallet(onUriReady: (String?) -> Unit) {
        viewModelScope.launch {
            _walletUiState.value = WalletUiState(state = WalletState.Connecting)
            walletRepository.connectWallet(onUriReady)
        }
    }

    fun disconnectWallet() {
        viewModelScope.launch {
            _walletUiState.value = WalletUiState(state = WalletState.Disconnecting)
            walletRepository.disconnectWallet()
            _walletUiState.value = WalletUiState(state = WalletState.Disconnected)
        }
    }
}

sealed class WalletState {
    object Idle: WalletState();
    object Connecting: WalletState();
    object Connected: WalletState();
    object Disconnecting: WalletState();
    object Disconnected: WalletState();
}

data class WalletUiState(
    val state: WalletState = WalletState.Idle,
    val walletAddress: String? = null
)