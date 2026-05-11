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
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.selfshield.admin.SelfShieldDeviceAdminReceiver
import com.selfshield.core.ui.theme.SelfShieldTheme
import com.selfshield.feature.onboarding.login.LoginScreen
import com.selfshield.feature.onboarding.signup.SignupScreen
import com.selfshield.feature.onboarding.connect.ConnectScreen
import dagger.hilt.android.AndroidEntryPoint
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.handleDeeplinks
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var supabaseClient: SupabaseClient

    @Inject
    lateinit var deviceManager: com.selfshield.core.data.identity.DeviceManager

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
                    startDestination = when (authState) {
                        is AuthState.Authenticated -> "main"
                        is AuthState.NeedsConnection -> "connect"
                        else -> "login"
                    }
                ) {
                    composable("login") {
                        LoginScreen(
                            onLoginSuccess = {
                                val target = if (mainViewModel.authState.value is AuthState.Authenticated) "main" else "connect"
                                navController.navigate(target) {
                                    popUpTo("login") { inclusive = true }
                                }
                            },
                            onNavigateToSignup = {
                                navController.navigate("signup")
                            }
                        )
                    }
                    composable("signup") {
                        SignupScreen(
                            onBackToLogin = {
                                navController.popBackStack()
                            },
                            onSignupSuccess = {
                                navController.navigate("connect") {
                                    popUpTo("signup") { inclusive = true }
                                }
                            }
                        )
                    }
                    composable("connect") {
                        ConnectScreen(
                            onConnectSuccess = {
                                navController.navigate("main") {
                                    popUpTo("connect") { inclusive = true }
                                }
                            },
                            onSignOut = {
                                navController.navigate("login") {
                                    popUpTo(0) { inclusive = true }
                                }
                            }
                        )
                    }
                    composable("main") {
                        Surface(
                            modifier = Modifier.fillMaxSize(),
                            color = MaterialTheme.colorScheme.background
                        ) {
                            MainScreen(
                                this@MainActivity, 
                                deviceManager.isPaired(),
                                onRefresh = { mainViewModel.checkConnection() },
                                onStatusUpdate = { acc, vpn -> mainViewModel.syncStatus(acc, vpn) }
                            )
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
fun MainScreen(
    context: ComponentActivity, 
    isPaired: Boolean, 
    onRefresh: () -> Unit,
    onStatusUpdate: (Boolean, Boolean) -> Unit
) {
    var isDeviceAdminEnabled by remember { mutableStateOf(checkDeviceAdmin(context)) }
    var isAccessibilityEnabled by remember { mutableStateOf(checkAccessibility(context)) }
    
    // Refresh status when app comes to foreground
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = androidx.lifecycle.LifecycleEventObserver { _, event ->
            if (event == androidx.lifecycle.Lifecycle.Event.ON_RESUME) {
                isDeviceAdminEnabled = checkDeviceAdmin(context)
                isAccessibilityEnabled = checkAccessibility(context)
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    // Sync status to cloud when permissions change
    LaunchedEffect(isDeviceAdminEnabled, isAccessibilityEnabled) {
        if (isPaired) {
            onStatusUpdate(isAccessibilityEnabled, true) // Assuming VPN active for now
        }
    }

    val prefs = context.getSharedPreferences("self_shield_prefs", Context.MODE_PRIVATE)
    var isChannelBlockEnabled by remember {
        mutableStateOf(prefs.getBoolean("channel_block_enabled", false))
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Spacer(modifier = Modifier.height(24.dp))

        // ========== Connection Status Card ==========
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = if (isPaired) 
                    MaterialTheme.colorScheme.primaryContainer 
                else 
                    MaterialTheme.colorScheme.errorContainer
            )
        ) {
            Row(
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Cloud Connection",
                        style = MaterialTheme.typography.titleSmall,
                        color = if (isPaired) 
                            MaterialTheme.colorScheme.onPrimaryContainer 
                        else 
                            MaterialTheme.colorScheme.onErrorContainer
                    )
                    Text(
                        text = if (isPaired) "Linked to Command Center" else "Not Connected",
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (isPaired) 
                            MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f) 
                        else 
                            MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                    )
                }
                Text(
                    text = if (isPaired) "✅" else "❌",
                    style = MaterialTheme.typography.headlineSmall
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

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
                onRefresh()
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
    val serviceId = "${context.packageName}/com.selfshield.service.accessibility.SelfShieldAccessibilityService"
    val enabled = try {
        Settings.Secure.getInt(context.contentResolver, Settings.Secure.ACCESSIBILITY_ENABLED)
    } catch (e: Settings.SettingNotFoundException) {
        0
    }
    
    if (enabled == 1) {
        val settingValue = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        )
        return settingValue?.contains(serviceId) == true
    }
    return false
}
