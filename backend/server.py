import logging
import os
import shutil
import subprocess
import time

from pathlib import Path
from flask import Flask, request, abort, jsonify
from flask_socketio import SocketIO, emit
from http import HTTPStatus

from util import internet_available

# initialize Flask application
app = Flask(__name__)
app.config['SECRET_KEY'] = 'my secret key'

# configure a fake network for when developing (e.g. not on a pi)
if os.environ.get('PYTHON_ENV') == 'dev':
    app.config['FAKE_NETWORK'] = True
else:
    app.config['FAKE_NETWORK'] = False

socketio = SocketIO(app)

"""
Summary of endpoints:

    Get the status of the server
      /api/status

    Get the available wifi networks (rpi only)
      /api/networks

    Get-- check if wifi is connected. Post-- given an SSID and password, set the wifi (rpi only)
      /api/wifi

    Get if recorder is recording and if player is playing
      /api/state

"""

# this is the path to where a wpa_supplicant file would be on an actual raspberry pi
WIFI_FILE = "/etc/wpa_supplicant/wpa_supplicant-wlan1.conf"
BACKUP_WIFI_FILE = '../system/wpa_supplicant-wlan1.conf'


def current_state():
    return {
        'state': 'ok!'
    }


@app.route('/')
def home():
    return 'Hello world!'


@app.route('/api/status/', methods=['GET'])
def status():
    return 'OK!'


@app.route('/api/networks/', methods=['GET'])
def scan_networks():
    logging.info('Scanning for WiFi networks...')
    if app.config['FAKE_NETWORK']:
        logging.warning('Using fake network response')
        lines = ['ESSID:"cortico"', 'ESSID:"eduroam"', 'ESSID:"Media Lab"']
    else:
        output = subprocess.check_output(
            'sudo iwlist wlan1 scan | grep ESSID', shell=True)
        lines = output.decode('utf-8').strip().split("\n")

    # example return:
    # ESSID:"cortico"
    # ESSID:"eduroam"
    # ESSID:"eduroam"
    # ESSID:"Media Lab"
    networks = set()
    for line in lines:
        # some that show up are "\x00" (null)-- ignore these
        if not "\\x" in line:
            name = line.split(":")[1].strip('\"')
            if name:
                networks.add(name)

    logging.info('Got networks: %s', networks)
    return jsonify(list(networks))


@app.route('/api/wifi', methods=['GET', 'POST'])
def set_wifi():
    # check if internet available
    if request.method == 'GET':
        logging.info('Checking if internet is available...')
        has_internet = internet_available()
        if has_internet:
            logging.info('Internet is available.')
        else:
            logging.info('Internet is not available.')

        return jsonify(has_internet)

    # handle POST (set wifi)
    # adapted from https://github.com/brendan-myers/rpi3-wifi-conf/blob/master/run.py
    payload = request.get_json()
    logging.info('Setting WiFi to %s', payload)
    # if we are in the dev environment, just sleep for a bit and return true
    if os.environ.get('PYTHON_ENV') == 'dev':
        logging.info('In dev mode, returning success')
        time.sleep(2)
        return jsonify(True)

    # otherwise, go and alter the rpi wifi files
    if payload and 'ssid' in payload:
        # open the existing wifi file and append to it
        with open(WIFI_FILE, 'a') as f:
            f.write("\nnetwork={\n")
            f.write('\tssid="{0}"\n'.format(payload['ssid']))
            if 'psk' in payload and payload['psk'] != '':
                f.write('\tpsk="{0}"\n'.format(payload['psk']))
            else:
                f.write("\tkey_mgmt=NONE\n")
            f.write("}\n")

        # restart wifi
        subprocess.call(['wpa_cli', '-i', 'wlan1', 'reconfigure'])

        # let it kick in
        time.sleep(10)

        emit_state()
        # see how we did
        if internet_available():
            logging.info(
                'Successfully got internet connection on %s', payload['ssid'])
            return jsonify(True)
        else:
            logging.info(
                'Failed to get internet connection on %s', payload['ssid'])
            return abort(HTTPStatus.NOT_ACCEPTABLE)

    logging.warning('Invalid WiFi payload in request')
    abort(HTTPStatus.BAD_REQUEST)


@app.route('/api/reset_settings/', methods=['POST'])
def reset_settings():
    logging.info(
        'Resetting the wpa_supplicant file to local copy in the repository')
    if os.environ.get('PYTHON_ENV') != 'dev':
        # back up the file in case we want to look at it later
        shutil.copyfile(WIFI_FILE, "{0}.bak".format(WIFI_FILE))
        shutil.copyfile(BACKUP_WIFI_FILE, WIFI_FILE)

        # restart wifi
        subprocess.call(['wpa_cli', '-i', 'wlan1', 'reconfigure'])

    return jsonify(True)


@app.route('/api/state/')
def get_state():
    return jsonify(current_state())


def emit_state():
    socketio.emit('state', current_state())


@socketio.on('connect')
def initial_connect():
    logging.info('Client connected [socket id: %s]', request.sid)
    emit_state()


def init_app():
    logging.info("Initializing backend...")

    """Read in config file"""

    """Initialize stuff"""

    return app


def main():
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s',
                        datefmt="%Y-%m-%d %H:%M:%S")

    init_app()

    logging.info("Initializing hearth-backend websocket...")
    socketio.run(app, host='0.0.0.0')


if __name__ == '__main__':
    main()
