# Control a Raspberry Pi with your phone
This is a simple example of how to get a phone and raspberry pi talking to each other wirelessly using common web technologies. This example uses Flask and React, but either could be replaced with your preferred stack. 

## Set up
This has been tested on the Raspberry Pi 3 Model B+ with the Raspbian Stretch Lite 04-08 image.

### With Ansible
* Download the latest [raspbian image](https://www.raspberrypi.org/downloads/raspbian/) and flash it to an SD card
* Insert your flashed SD card into your Raspberry Pi and connect it to a monitor and keyboard
* Log in to the OS (default username: `pi` default password: `raspberry`)
* Connect your pi to the internet 
* [Install Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#latest-releases-via-apt-debian)
  * You may need to install dirmngr first to do this (`sudo apt-get -y install dirmngr`)
  * You may also need to use the url `hkp://keyserver.ubuntu.com:80` for the Ubuntu keyserver
* Download this repository to your pi
