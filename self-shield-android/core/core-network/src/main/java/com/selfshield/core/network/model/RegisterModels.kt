package com.selfshield.core.network.model

import kotlinx.serialization.Serializable

@Serializable
data class RegisterRequest(
    val device_id: String,
    val device_name: String,
    val os_version: String,
    val model: String
)

@Serializable
data class RegisterResponse(
    val pairing_code: String,
    val status: String
)

@Serializable
data class ClaimRequest(
    val pairing_code: String,
    val device_id: String,
    val fcm_token: String?,
    val device_name: String,
    val os_version: String,
    val model: String
)

@Serializable
data class ClaimResponse(
    val device_id: String,
    val admin_id: String,
    val status: String
)
