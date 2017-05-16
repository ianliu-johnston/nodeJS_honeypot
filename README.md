# NodeJS Honeypot
Honeypot written in NodeJS that serves a variety of URI's to hungry bots. Currently in progress. Shown here for reference only.

## This is currently in progress! Goals:
Replicates SQL injection functionality, serves commonly requested resources, and adapts to new exploits by dynamically creating new resources. If the option is enabled, it also safely downloads binaries into a container. Also, if the option is enabled, it runs a webserver on port 40298 to display status of honeypot, and data.

## Setup
### Prerequisites
This honeypot was built on Ubuntu 16.04 LTS, but is not designed explicitly for portability. The setup script uses bash, and installs with apt-get, so manual installation may be required for systems other than Ubuntu 16.04.

Run ``./setup.sh`` to install dependencies.

### Required packages:
``git``, ``tshark``, ``docker``, ``docker.io``, ``mysql-5.7.18``, ``nodejs``, ``python3``, python modules: ``flask``, ``sqlalchemy``, and ``mysqlclient``

### Installation
1. Clone this repository and run ``setup.sh``
2. Run the program start-up script to start capturing: ``honey_run.sh``

## Origin
This honeypot is written from research for a [security whitepaper](url.com). The data from this research is located [on GitHub](https://github.com/wintermanc3r/honey.git)

## Author
* **Ian Liu-Johnston** -- Connect with me through [Twitter](https://twitter.com/Concativerse), [Linkedin](Linkedin.com), or find other projects on [ianxaunliu-johnston.com](https://ianxaunliu-johnston.com)
