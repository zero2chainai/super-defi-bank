package com.example.superdefibank.contracts

import org.web3j.abi.FunctionEncoder
import org.web3j.abi.datatypes.Function
import org.web3j.abi.datatypes.Type
import org.web3j.abi.datatypes.generated.Uint256
import java.math.BigInteger

object BankContractEncoder {

    fun encodeDeposit(amount: BigInteger): String {
        val function = Function(
            "deposit",
            listOf<Type<*>>(Uint256(amount)),
            emptyList()
        )
        return FunctionEncoder.encode(function)
    }

    fun encodeWithdraw(amount: BigInteger): String {
        val function = Function(
            "withdraw",
            listOf<Type<*>>(Uint256(amount)),
            emptyList()
        )
        return FunctionEncoder.encode(function)
    }
}