# Self-Shield Browser Extension (Cold Turkey Mode)

This extension provides powerful website blocking synced with your Self-Shield Admin Panel.

## Features
- **Dynamic Blocking**: Syncs blocklists from Supabase every 5 minutes.
- **Admin Lock**: Protection status can only be toggled from the Admin Panel.
- **Custom Blocked Page**: Professional UI when a site is restricted.

## How to Install (Developer Mode)
1. Open Chrome/Edge and go to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `self-shield-extension` folder.
5. Click the extension icon and enter your **Device ID** from the Admin Panel to pair.

## 🛡️ "Cold Turkey" Level Protection (Un-removable)
To make this extension impossible to disable or remove without Admin access, you must "Force Install" it using Windows Registry or Group Policy.

### Windows Registry Method:
1. Note the Extension ID (found in `chrome://extensions` after loading it).
2. Open `regedit` (Registry Editor).
3. Navigate to: `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist` (Create keys if they don't exist).
4. Create a new String Value (`REG_SZ`) named `1`.
5. Set its value to: `[EXTENSION_ID];https://clients2.google.com/service/update2/crx`
   - *Example:* `abcdefghijklmnopqrstuvwxyz;https://clients2.google.com/service/update2/crx`

Once added, the extension will be marked as "Managed by your organization" and the "Remove" and "Disable" buttons will be hidden.

## Syncing with Supabase
The extension is pre-configured to talk to the Self-Shield Supabase instance. It fetches settings from the following tables:

### 1. `devices` table:
- `id` (uuid, primary key)
- `is_admin_active` (boolean) - Used for instant unpairing.

### 2. `device_settings` table:
- `device_id` (uuid, foreign key to `devices.id`)
- `is_enabled` (boolean)
- `safe_search_enabled` (boolean)
- `blocked_urls` (text array)
- `blocked_keywords` (text array)
- `last_sync` (timestamp)
