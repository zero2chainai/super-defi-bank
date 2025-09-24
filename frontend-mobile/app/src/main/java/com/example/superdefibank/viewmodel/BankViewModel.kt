package com.example.superdefibank.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.superdefibank.repository.BankRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class BankViewModel @Inject constructor(
    private val bankRepository: BankRepository
): ViewModel() {
    val depositState = bankRepository.depositState

    fun deposit(amount: String) {
        viewModelScope.launch {
            bankRepository.deposit(amount)
        }
    }
}