package com.example.superdefibank.repository

import com.example.superdefibank.contracts.BankContractEncoder
import com.walletconnect.sign.client.Sign
import com.walletconnect.sign.client.SignClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import org.json.JSONArray
import org.json.JSONObject
import timber.log.Timber
import java.math.BigDecimal

class BankRepository(
    private val walletRepository: WalletRepository
) {

    private fun getActiveTopic(): String? = walletRepository.activeSessionTopic
    private fun getWalletAddress(): String? = walletRepository.walletAddress.value
    private val bankAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    private val _depositState = MutableStateFlow<DepositState>(DepositState.Idle)
    val depositState: StateFlow<DepositState> = _depositState

    fun deposit(amount: String) {
        Timber.d("------- Deposit Started -------")

        val topic = getActiveTopic() ?: return
        val walletAddress = getWalletAddress() ?: return

        val weiValue = amount.toBigDecimal()
            .multiply(BigDecimal.TEN.pow(18))
            .toBigInteger()

        val data = BankContractEncoder.encodeDeposit(weiValue)

        val tx = JSONObject().apply {
            put("from", walletAddress)
            put("to", bankAddress)
            put("data", data)
            put("value" , "0x" + weiValue.toString(16))
        }

        Timber.d("Deposit Tx: $tx")

        val request = Sign.Params.Request(
            sessionTopic = topic,
            method = "eth_sendTransaction",
            params = JSONArray().put(tx).toString(),
            chainId = "eip155:31337"
        )

        SignClient.request(
            request,
            onSuccess = { response: Sign.Model.SentRequest ->
                Timber.d("Deposit Success: $response")
                _depositState.value = DepositState.Pending(response)
            },
            onError = { error: Sign.Model.Error ->
                Timber.e("Deposit Error: $error")
                _depositState.value = DepositState.Error(error)
            }
        )
        Timber.d("------- Deposit Ended -------")
    }
}

sealed class DepositState {
    object Idle: DepositState()
    data class Pending(val response: Sign.Model.SentRequest): DepositState()
    data class Success(val txHash: String): DepositState()
    data class Error(val error: Sign.Model.Error): DepositState()
}