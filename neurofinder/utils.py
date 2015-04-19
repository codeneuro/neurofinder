from termcolor import colored
import os


class quiet(object):
    """ Minmize stdout and stderr from external processes """
    def __init__(self):
        self.null_fds = [os.open(os.devnull, os.O_RDWR) for _ in range(2)]
        self.save_fds = (os.dup(1), os.dup(2))

    def __enter__(self):
        os.dup2(self.null_fds[0], 1)
        os.dup2(self.null_fds[1], 2)

    def __exit__(self, *_):
        os.dup2(self.save_fds[0], 1)
        os.dup2(self.save_fds[1], 2)
        os.close(self.null_fds[0])
        os.close(self.null_fds[1])


class printer(object):

    @classmethod
    def status(cls, msg):
        print("    [" + msg + "]")

    @classmethod
    def success(cls, msg="success"):
        print("    [" + colored(msg, 'green') + "]")

    @classmethod
    def error(cls, msg="failed"):
        print("    [" + colored(msg, 'red') + "]")
