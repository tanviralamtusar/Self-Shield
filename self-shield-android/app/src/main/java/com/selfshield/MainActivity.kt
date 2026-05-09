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
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.selfshield.admin.SelfShieldDeviceAdminReceiver
import com.selfshield.core.ui.theme.SelfShieldTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SelfShieldTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainScreen(this)
                }
            }
        }
    }
}

@Composable
fun MainScreen(context: ComponentActivity) {
    var isDeviceAdminEnabled by remember { mutableStateOf(checkDeviceAdmin(context)) }
    var isAccessibilityEnabled by remember { mutableStateOf(checkAccessibility(context)) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Self-Shield Protection", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(32.dp))

        Text(text = "Device Admin: ${if (isDeviceAdminEnabled) "Enabled" else "Disabled"}")
        Button(
            onClick = {
                if (!isDeviceAdminEnabled) {
                    val componentName = ComponentName(context, SelfShieldDeviceAdminReceiver::class.java)
                    val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
                        putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, componentName)
                        putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Required for Self-Shield protection.")
                    }
                    context.startActivity(intent)
                }
            },
            modifier = Modifier.padding(top = 8.dp)
        ) {
            Text(if (isDeviceAdminEnabled) "Device Admin Active" else "Enable Device Admin")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(text = "Accessibility: ${if (isAccessibilityEnabled) "Enabled" else "Disabled"}")
        Button(
            onClick = {
                if (!isAccessibilityEnabled) {
                    val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                    context.startActivity(intent)
                }
            },
            modifier = Modifier.padding(top = 8.dp)
        ) {
            Text(if (isAccessibilityEnabled) "Accessibility Active" else "Enable Accessibility")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = {
                isDeviceAdminEnabled = checkDeviceAdmin(context)
                isAccessibilityEnabled = checkAccessibility(context)
            }
        ) {
            Text("Refresh Status")
        }
    }
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
