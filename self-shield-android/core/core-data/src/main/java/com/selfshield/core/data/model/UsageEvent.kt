package com.selfshield.core.data.model

import kotlinx.serialization.Serializable

@Serializable
data class UsageEvent(
    val deviceId: String,
    val eventType: String,
    val target: String?,
    val durationSec: Int?,
    val occurredAt: String
)
