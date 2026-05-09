package com.selfshield

import android.accessibilityservice.AccessibilityServiceInfo
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.selfshield.admin.SelfShieldDeviceAdminReceiver
import com.selfshield.core.ui.theme.SelfShieldTheme
import com.selfshield.feature.onboarding.login.LoginScreen
import dagger.hilt.android.AndroidEntryPoint
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.handleDeeplinks
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var supabaseClient: SupabaseClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleIntent(intent)
        setContent {
            SelfShieldTheme {
                val navController = rememberNavController()
                val mainViewModel: MainViewModel = viewModel()
                val authState by mainViewModel.authState.collectAsState()

                NavHost(
                    navController = navController,
                    startDestination = if (authState == AuthState.Authenticated) "main" else "login"
                ) {
                    composable("login") {
                        LoginScreen(onLoginSuccess = {
                            navController.navigate("main") {
                                popUpTo("login") { inclusive = true }
                            }
                        })
                    }
                    composable("main") {
                        Surface(
                            modifier = Modifier.fillMaxSize(),
                            color = MaterialTheme.colorScheme.background
                        ) {
                            MainScreen(this@MainActivity)
                        }
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        intent?.let {
            supabaseClient.handleDeeplinks(it)
        }
    }
}

@Composable
fun MainScreen(context: ComponentActivity) {
    var isDeviceAdminEnabled by remember { mutableStateOf(checkDeviceAdmin(context)) }
    var isAccessibilityEnabled by remember { mutableStateOf(checkAccessibility(context)) }

    val prefs = context.getSharedPreferences("self_shield_prefs", Context.MODE_PRIVATE)
    var isChannelBlockEnabled by remember {
        mutableStateOf(prefs.getBoolean("channel_block_enabled", false))
    }

    // Removed auto-redirection as requested.
    // User can now manually enable permissions using the buttons below.

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Self Shield Protection", 
            style = MaterialTheme.typography.headlineMedium,
            color = if (isAccessibilityEnabled && isDeviceAdminEnabled) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        if (!isAccessibilityEnabled || !isDeviceAdminEnabled) {
            Text(
                text = "Action Required: Please enable all permissions for full protection.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.error
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        PermissionItem(
            label = "Device Admin",
            isEnabled = isDeviceAdminEnabled,
            onClick = { requestDeviceAdmin(context) }
        )

        Spacer(modifier = Modifier.height(16.dp))

        PermissionItem(
            label = "Accessibility Service",
            isEnabled = isAccessibilityEnabled,
            onClick = {
                val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                context.startActivity(intent)
            }
        )

        Spacer(modifier = Modifier.height(32.dp))

        // ========== WhatsApp Channel Block Toggle ==========
        Text(
            text = "Features",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Block WhatsApp Channels",
                    style = MaterialTheme.typography.bodyLarge
                )
                Text(
                    text = if (isChannelBlockEnabled) "Channels are blocked" else "Channels are allowed",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (isChannelBlockEnabled) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Switch(
                checked = isChannelBlockEnabled,
                onCheckedChange = { enabled ->
                    isChannelBlockEnabled = enabled
                    prefs.edit().putBoolean("channel_block_enabled", enabled).apply()
                }
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = {
                isDeviceAdminEnabled = checkDeviceAdmin(context)
                isAccessibilityEnabled = checkAccessibility(context)
            },
            modifier = Modifier.fillMaxWidth(0.7f)
        ) {
            Text("Refresh Status")
        }
    }
}


@Composable
fun PermissionItem(label: String, isEnabled: Boolean, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = "$label: ${if (isEnabled) "✅ Active" else "❌ Disabled"}",
            style = MaterialTheme.typography.bodyLarge
        )
        Button(
            onClick = onClick,
            modifier = Modifier.padding(top = 8.dp).fillMaxWidth(0.8f),
            enabled = !isEnabled
        ) {
            Text(if (isEnabled) "$label is Active" else "Enable $label")
        }
    }
}

fun requestDeviceAdmin(context: Context) {
    val componentName = ComponentName(context, SelfShieldDeviceAdminReceiver::class.java)
    val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
        putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
        putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Required for Self Shield protection.")
    }
    context.startActivity(intent)
}

fun checkDeviceAdmin(context: Context): Boolean {
    val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
    val componentName = ComponentName(context, SelfShieldDeviceAdminReceiver::class.java)
    return dpm.isAdminActive(componentName)
}

fun checkAccessibility(context: Context): Boolean {
    val am = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
    val enabledServices = am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC)
    return enabledServices.any { it.resolveInfo.serviceInfo.packageName == context.packageName }
}
