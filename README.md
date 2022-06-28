# ACIDS 2022 NIME Workshop #3
-------

## Overview

 This guide will help you setup everything you need for the ACIDS 2022 NIME Workshop #3

## Requirements

- Computer (All OSes should work)
- Raspberry Pi 4 (3b+ is possible but will probably lag a bit)
- Ethernet cable (Wifi is possible, but you'll need to connect manually)

----------

## Flash the OS onto your microSD card
[Raspberry Pi Imager](https://www.raspberrypi.com/software/) is the quick and easy way to install an operating system to a microSD card ready to use with your Raspberry Pi.

- Insert your microSD card in your computer
- Open Raspberry Pi Imager, click on "Choose OS" -> "Other" -> "Raspberry Pi OS Lite 64bits"
- Select the microSD as the target destination
- in the settings tab enable SSH
- in the settings tab, if you'll be using wifi, add the SSID and password of your wifi network
- Launch the write process

## Get your RaspberryPi ip adress
either:
- connect your rapsberrypi to a monitor & a keyboard, open a terminal and type ``ifconfig``
- check your modem admin panel for connected equipements
- scan your network with ``sudo nmap -sn 192.168.1.0/24`` (will probably not work on complex networks like those used in companies, universities etc...)

## Connect using SSH
from your computer: ``ssh pi@{IP_ADDRESS}``

## Setup the dev environment on the RaspberryPi
```
sudo apt-get update -y
sudo apt-get install git pip libportaudio2 libsndfile1 -y

git clone https://github.com/dgenova/RAVEberry-server.git
cd RAVEberry-server
pip install -r Requirements.txt
```

## Setup the webclient on your computer
```
git clone https://github.com/ZodiacFRA/RaveBerry
cd RaveBerry
python -m http.server
```
- open the url given at the http server launch
- in the interface enter the ip and port of the raspberrypi and connect
