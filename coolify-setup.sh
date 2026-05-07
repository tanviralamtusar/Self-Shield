#!/bin/bash

# Coolify Production Hardening Script
# For Ubuntu 22.04/24.04

echo "Starting Server Hardening for Self-Shield..."

# 1. Update and Upgrade
sudo apt update && sudo apt upgrade -y

# 2. Install Essentials
sudo apt install -y curl wget git ufw fail2ban

# 3. Setup UFW Firewall
echo "Configuring Firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp # Coolify initial setup
sudo ufw --force enable

# 4. Fail2ban Setup
echo "Configuring Fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 5. Coolify Installation
echo "Installing Coolify..."
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

echo "----------------------------------------------------"
echo "Setup Complete!"
echo "Next Steps:"
echo "1. Visit http://$(curl -s ifconfig.me):8000"
echo "2. Create your admin account."
echo "3. Connect your GitHub repository."
echo "4. Set your domain to self-shield.botbhai.net"
echo "----------------------------------------------------"
