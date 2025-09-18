package com.example.superdefibank.repository

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.walletconnect.android.CoreClient
import com.walletconnect.sign.client.Sign
import com.walletconnect.sign.client.SignClient
import timber.log.Timber

class WalletRepository {
    private val _walletAddress = MutableLiveData<String?>()
    val walletAddress: LiveData<String?> = _walletAddress

    fun connectWallet(onUriReady: (String?) -> Unit) {
        // Connect to wallet and the URI
        val pairing = CoreClient.Pairing.create() ?: return
        val connectParams = Sign.Params.Connect(
            namespaces = mapOf(
                "eip155" to Sign.Model.Namespace.Proposal(
                    chains = listOf("eip155:1"),
                    methods = listOf("eth_signTransaction", "personal_sign", "eth_signTypedData"),
                    events = listOf("chainChanged", "accountsChanged")
                )
            ),
            pairing = pairing
        )

        // Connection
        SignClient.connect(
            connectParams,
            onSuccess = { uri -> onUriReady(uri) },
            onError = { error -> Timber.e("Error connecting to wallet: $error") }
        )
    }

    // Function to register callbacks for wallet events
    fun registerCallback() {
        val dappDelegate = object : SignClient.DappDelegate {
            override fun onConnectionStateChange(state: Sign.Model.ConnectionState) {
                Timber.d("Connection state change: $state")
            }
            override fun onSessionApproved(approvedSession: Sign.Model.ApprovedSession) {
                val accounts = approvedSession.namespaces["eip155"]?.accounts
                val walletAddress = accounts?.firstOrNull()?.split(":")?.get(2)

                _walletAddress.postValue(walletAddress)
                Timber.i("Session approved: $approvedSession")
                Timber.i("Wallet address: $walletAddress")
            }
            override fun onSessionRejected(rejectedSession: Sign.Model.RejectedSession) {
                Timber.w("Session rejected: $rejectedSession")
            }
            override fun onSessionDelete(deletedSession: Sign.Model.DeletedSession) {
                Timber.w("Session deleted: $deletedSession")
                _walletAddress.postValue(null)
            }
            override fun onProposalExpired(proposal: Sign.Model.ExpiredProposal) {
                Timber.w("Proposal expired: $proposal")
            }
            override fun onRequestExpired(request: Sign.Model.ExpiredRequest) {
                Timber.w("Request expired: $request")
            }
            override fun onError(error: Sign.Model.Error) {
                Timber.e("Error: $error")
            }
            override fun onSessionUpdate(updatedSession: Sign.Model.UpdatedSession) {}
            override fun onSessionEvent(sessionEvent: Sign.Model.SessionEvent) {}
            override fun onSessionRequestResponse(response: Sign.Model.SessionRequestResponse) {}
            override fun onSessionExtend(session: Sign.Model.Session) {}
        }
        SignClient.setDappDelegate(dappDelegate)
    }

    fun disconnectWallet() {

    }
}