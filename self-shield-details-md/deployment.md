# 🚀 Self-Shield Deployment Guide

This document contains the complete production deployment plan and instructions for **Self-Shield**.

## 🏗️ Architecture Overview
- **Orchestrator**: Coolify
- **Reverse Proxy**: Traefik (Auto-managed by Coolify)
- **Runtime**: Docker (Multi-stage builds)
- **Framework**: Next.js (Standalone Mode)
- **DNS/CDN**: Cloudflare (Proxied)

## 🛠️ Server Preparation
1. **OS**: Ubuntu 22.04 or 24.04 LTS.
2. **Setup Script**: Run the included setup script on your VPS:
   ```bash
   chmod +x coolify-setup.sh
   ./coolify-setup.sh
   ```
   *This script installs Docker, Coolify, Firewall (UFW), and Fail2ban.*

## 📦 Coolify Configuration
Once Coolify is installed (`http://your-ip:8000`):

### 1. Project Setup
- Create a new Project called `Self-Shield`.
- Connect your GitHub repository.
- Branch: `main` (or `develop`).

### 2. Environment Variables
Add the following in the Coolify UI (Environment Variables tab):
| Variable | Value | Type |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Build Time |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Anon Key | Build Time |
| `DATABASE_URL` | Your Database URL | Secret |
| `NEXT_TELEMETRY_DISABLED` | `1` | Static |

### 3. Health Check
- **Path**: `/api/health`
- **Port**: `3000`

## 🛡️ Security Best Practices
- **Cloudflare**: Set SSL/TLS to **Full (Strict)**.
- **SSH**: Disable password authentication in `/etc/ssh/sshd_config`.
- **Secrets**: Rotate `SUPABASE_SERVICE_ROLE_KEY` every 90 days.

## 🩺 Diagnostics
Run these on the VPS to verify system health:
```bash
# Check container status
docker ps | grep self-shield

# Check logs
docker logs -f $(docker ps -q --filter "name=self-shield")
```

## 🔄 CI/CD Workflow
1. **GitHub Action**: Every push triggers a Lint/Build check in GitHub.
2. **Coolify Webhook**: If GitHub check passes, Coolify automatically pulls and redeploys the app with zero downtime.

---
*Created by Antigravity AI Deployment Architect.*
