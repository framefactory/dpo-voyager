#!/bin/bash
# DOCKER IMAGE PROVISIONING SCRIPT
# INSTALL UBUNTU WITH NODE.JS

# Create application directory
mkdir /app

# Install utilities
apt-get install -y vim wget curl bzip2 git

# Install build essentials (required for NPM package compilation)
apt-get install -y build-essential libssl-dev python

# Install NVM (node version manager)
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# load NVM
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# install node.js
nvm install 12.16.2
nvm use 12.16.2
nvm alias default 12.16.2

# update npm
npm i -g npm

# Check node versions
node --version
npm --version

# some helpful bash aliases
cat <<EOF >> ~/.bash_aliases
alias ll='ls -la'
alias ..='cd ..'
EOF
