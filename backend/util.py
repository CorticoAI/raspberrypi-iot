import socket


def internet_available() -> bool:
    """Returns True or False for if internet is available
    
    Returns:
        bool -- if internet is available
    """
    
    try:
        # from https://stackoverflow.com/questions/20913411/test-if-an-internet-connection-is-present-in-python
        hostname = 'www.google.com'
        # see if we can resolve the host name -- tells us if there is a DNS listening
        host = socket.gethostbyname(hostname)
        # connect to the host -- tells us if the host is actually
        # reachable
        socket.create_connection((host, 80), 2)
        return True
    except:
        return False
