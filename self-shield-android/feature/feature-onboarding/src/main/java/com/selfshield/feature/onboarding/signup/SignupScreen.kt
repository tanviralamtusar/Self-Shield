package com.selfshield.feature.onboarding.signup

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(
    onBackToLogin: () -> Unit,
    onSignupSuccess: () -> Unit,
    viewModel: SignupViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    
    val passwordsMatch = password == confirmPassword && password.isNotEmpty()
    val isPasswordValid = password.length >= 8
    
    LaunchedEffect(uiState) {
        if (uiState is SignupUiState.Success) {
            onSignupSuccess()
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF121212) // Dark background like the image
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Shield Icon
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(Color(0xFF1E1E1E), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = "Shield Icon",
                    modifier = Modifier.size(32.dp),
                    tint = Color(0xFF4A80F0) // Blue color from the image
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Create Account",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 32.sp
                ),
                color = Color.White
            )
            
            Text(
                text = "Sign up for Self-Shield to get started",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                modifier = Modifier.padding(top = 8.dp)
            )

            Spacer(modifier = Modifier.height(40.dp))

            // Email Field
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Email",
                    style = MaterialTheme.typography.labelLarge,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    placeholder = { Text("m@example.com", color = Color.Gray) },
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
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Password Field
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Password",
                    style = MaterialTheme.typography.labelLarge,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    placeholder = { Text("Create a strong password", color = Color.Gray) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    visualTransformation = PasswordVisualTransformation(),
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
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
                )
                Text(
                    text = "Must be at least 8 characters",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (password.isNotEmpty() && !isPasswordValid) MaterialTheme.colorScheme.error else Color.Gray,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Confirm Password Field
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Confirm Password",
                    style = MaterialTheme.typography.labelLarge,
                    color = Color.White,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    placeholder = { Text("Confirm your password", color = Color.Gray) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    visualTransformation = PasswordVisualTransformation(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = if (confirmPassword.isNotEmpty() && !passwordsMatch) MaterialTheme.colorScheme.error else Color(0xFF4A80F0),
                        unfocusedBorderColor = if (confirmPassword.isNotEmpty() && !passwordsMatch) MaterialTheme.colorScheme.error else Color(0xFF2C2C2C),
                        focusedContainerColor = Color(0xFF1E1E1E),
                        unfocusedContainerColor = Color(0xFF1E1E1E),
                        cursorColor = Color(0xFF4A80F0),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
                )
                if (confirmPassword.isNotEmpty() && !passwordsMatch) {
                    Text(
                        text = "Passwords do not match",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            if (uiState is SignupUiState.Error) {
                Text(
                    text = (uiState as SignupUiState.Error).message,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            Button(
                onClick = { viewModel.signUp(email, password) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                enabled = uiState !is SignupUiState.Loading && email.isNotBlank() && isPasswordValid && passwordsMatch,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF4A80F0),
                    disabledContainerColor = Color(0xFF4A80F0).copy(alpha = 0.5f)
                )
            ) {
                if (uiState is SignupUiState.Loading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "Create Account",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            
            Divider(color = Color(0xFF2C2C2C), thickness = 1.dp)
            
            Spacer(modifier = Modifier.height(24.dp))

            val annotatedString = buildAnnotatedString {
                withStyle(style = SpanStyle(color = Color.Gray)) {
                    append("Already have an account? ")
                }
                pushStringAnnotation(tag = "signin", annotation = "signin")
                withStyle(style = SpanStyle(color = Color(0xFF4A80F0), fontWeight = FontWeight.Bold)) {
                    append("Sign in")
                }
                pop()
            }

            ClickableText(
                text = annotatedString,
                onClick = { offset ->
                    annotatedString.getStringAnnotations(tag = "signin", start = offset, end = offset)
                        .firstOrNull()?.let {
                            onBackToLogin()
                        }
                },
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
