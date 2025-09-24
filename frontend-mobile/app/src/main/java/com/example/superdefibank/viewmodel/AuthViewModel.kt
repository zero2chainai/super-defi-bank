package com.example.superdefibank.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.superdefibank.model.User
import com.example.superdefibank.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _authUiState = MutableStateFlow(AuthUiState())
    val authUiState: StateFlow<AuthUiState> = _authUiState

    fun register(name: String, walletAddress: String) {
        Timber.d("--------- Register Started ----------")
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(state = AuthState.Loading)
            try {
                val response = authRepository.register(name, walletAddress)
                Timber.d("Response: ${response.body()}")
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null && body.success) {
                        Timber.d("Registration Successful: ${body.data}")
                        _authUiState.value = _authUiState.value.copy(
                            state = AuthState.success(body.message),
                            user = body.data
                        )
                    }
                } else {
                    val errorJson = response.errorBody()?.string()
                    Timber.e("Unsuccessful Registration Request: $errorJson")
                    val errorMsg = try {
                        val json = JSONObject(errorJson ?: "")
                        json.getString("message")
                    } catch (e: Exception) {
                        e.message ?: "Unknown error"
                    }
                    _authUiState.value = _authUiState.value.copy(
                        state = AuthState.Error(errorMsg)
                    )
                }
            } catch (e: Exception) {
                Timber.e("Registration Failed: ${e.message}")
            }
        }
        Timber.d("--------- Register Ended ----------")
    }

    fun login(walletAddress: String) {
        Timber.d("--------- Login Started ----------")
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(state = AuthState.Loading)
            try {
                val response = authRepository.login(walletAddress)
                Timber.d("Response: ${response.body()}")
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null && body.success) {
                        Timber.d("Login Successful: ${body.data}")
                        _authUiState.value = _authUiState.value.copy(
                            state = AuthState.success(body.message),
                            user = body.data
                        )
                    }
                } else {
                    val errorJson = response.errorBody()?.string()
                    Timber.e("Unsuccessful Login Request: $errorJson")
                    val errorMsg = try {
                        val json = JSONObject(errorJson ?: "")
                        json.getString("message")
                    } catch (e: Exception) {
                        e.message ?: "Unknown error"
                    }
                    _authUiState.value = _authUiState.value.copy(
                        state = AuthState.Error(errorMsg)
                    )
                }
            } catch (e: Exception) {
                Timber.e("Login Failed: ${e.message}")
            }
        }
        Timber.d("--------- Login Ended ----------")
    }
}

sealed class AuthState {
    object Idle: AuthState();
    object Loading: AuthState();
    object Loggedout: AuthState();
    data class success(val message: String): AuthState();
    data class Error(val message: String): AuthState()
}

data class AuthUiState(
    val state: AuthState = AuthState.Idle,
    val user: User? = null
)