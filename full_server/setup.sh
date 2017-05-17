#!/bin/bash
# Sets up a honeypot server automagically

sudo apt-get update

# Install python, node, docker and git
sudo apt-get install -y \
	python3-pip python3-dev \
	nodejs npm \
	docker docker.io git

DEBIAN_FRONTEND=noninteractive sudo apt-get install -y tshark

# Install mysql
./mysql-autosetup.sh

# Update pip3 and install pep8, Flask, sqlalchemy and mysqlclient
sudo -H pip3 install --update pip
sudo -H pip3 install pep8 Flask sqlalchemy mysqlclient

# Create new firewall rules to serve content
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3080
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3080/tcp
sudo ufw allow 3081/tcp

./honey_run.sh
