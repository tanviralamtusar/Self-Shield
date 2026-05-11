package com.selfshield.feature.onboarding.connect

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Link
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConnectScreen(
    onConnectSuccess: () -> Unit,
    viewModel: ConnectViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var pairingCode by remember { mutableStateOf("") }

    LaunchedEffect(uiState) {
        if (uiState is ConnectUiState.Success) {
            onConnectSuccess()
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF121212)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Link Icon
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(Color(0xFF1E1E1E), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Link,
                    contentDescription = "Connect Icon",
                    modifier = Modifier.size(32.dp),
                    tint = Color(0xFF4A80F0)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Connect Device",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 32.sp
                ),
                color = Color.White
            )

            Text(
                text = "Enter the pairing code from your dashboard to connect this device",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 8.dp, start = 16.dp, end = 16.dp)
            )

            Spacer(modifier = Modifier.height(40.dp))

            // Pairing Code Field
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Pairing Code",
                    style = MaterialTheme.typography.labelLarge,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                OutlinedTextField(
                    value = pairingCode,
                    onValueChange = { 
                        if (it.length <= 10) pairingCode = it.uppercase() 
                    },
                    placeholder = { Text("ABC-123", color = Color.Gray) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF4A80F0),
                        unfocusedBorderColor = Color(0xFF2C2C2C),
                        focusedContainerColor = Color(0xFF1E1E1E),
                        unfocusedContainerColor = Color(0xFF1E1E1E),
                        cursorColor = Color(0xFF4A80F0),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    singleLine = true,
                    textStyle = MaterialTheme.typography.headlineSmall.copy(
                        textAlign = TextAlign.Center,
                        letterSpacing = 4.sp
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            if (uiState is ConnectUiState.Error) {
                Text(
                    text = (uiState as ConnectUiState.Error).message,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            Button(
                onClick = { viewModel.connectDevice(pairingCode) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                enabled = uiState !is ConnectUiState.Loading && pairingCode.isNotBlank(),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF4A80F0),
                    disabledContainerColor = Color(0xFF4A80F0).copy(alpha = 0.5f)
                )
            ) {
                if (uiState is ConnectUiState.Loading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "Connect Device",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            
            TextButton(
                onClick = { /* Could add logout here if needed */ },
                enabled = uiState !is ConnectUiState.Loading
            ) {
                Text(
                    text = "Need help finding your code?",
                    color = Color.Gray,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}
