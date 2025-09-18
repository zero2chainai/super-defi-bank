package com.example.superdefibank

import android.app.Application
import com.walletconnect.android.Core
import com.walletconnect.android.CoreClient
import com.walletconnect.android.relay.ConnectionType
import com.walletconnect.sign.client.Sign
import com.walletconnect.sign.client.SignClient
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

@HiltAndroidApp
class SuperDeFiBankApp: Application() {
    override fun onCreate() {
        super.onCreate()

        // Initializing CoreClient and SignClient
        val projectId = "104ce761ed46b94e3327f282c15dfd0c"
        val connectionType = ConnectionType.AUTOMATIC
        val metaData = Core.Model.AppMetaData(
            name = "Super DeFi Bank",
            description = "Super DeFi Bank",
            url = "https://superdefibank.com",
            icons = listOf("https://superdefibank.com/logo.png"),
            redirect = "SuperDeFiBank://"
        )

        // CoreClient Initialization
        CoreClient.initialize(
            application = this,
            connectionType = connectionType,
            metaData = metaData,
            projectId = projectId
        ) { error ->
            Timber.e("Error initializing CoreClient: $error")
        }

        // SignClient Initialization
        val signInitParams = Sign.Params.Init(core = CoreClient)
        SignClient.initialize(signInitParams) { error ->
            Timber.e("Error initializing SignClient: $error")
        }
    }
}