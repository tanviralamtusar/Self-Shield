package com.selfshield.core.network.api

import com.selfshield.core.network.model.ClaimRequest
import com.selfshield.core.network.model.ClaimResponse
import com.selfshield.core.network.model.RegisterRequest
import com.selfshield.core.network.model.RegisterResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface SupabaseApi {
    
    @POST("api/devices/register")
    suspend fun registerDevice(
        @Body request: RegisterRequest
    ): Response<RegisterResponse>

    @POST("api/devices/claim")
    suspend fun claimDevice(
        @Body request: ClaimRequest
    ): Response<ClaimResponse>
}
