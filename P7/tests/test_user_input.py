import unittest
from unittest import mock
from src.user_input import read_string, read_float,read_float_range,read_integer,read_integer_range

class TestUserInput(unittest.TestCase):
    """Class used for testing the user input methods"""
    @mock.patch('builtins.input')
    def test_read_string(self, inp):
        """Testing the read string method"""
        inp.return_value = 'hello world!'
        self.assertEqual('hello world!', read_string('Enter a value: '))

    @mock.patch('src.user_input.read_string')
    def test_read_integer(self, readstr):
        """Testing the read integer method"""
        readstr.side_effect = ['hello world!', '1']
        self.assertEqual(1, read_integer('Enter an integer: '))

    @mock.patch('src.user_input.read_string')
    def test_read_float(self, readstr):
        """Testing the read float method"""
        readstr.side_effect = ['hello world!', '1.5']
        self.assertEqual(1.5, read_float('Enter an float: '))

    @mock.patch('src.user_input.read_string')
    def test_read_integer_range(self, readstr):
        """Testing the read integer range method"""
        readstr.side_effect = ['10', '3']
        self.assertEqual(3, read_integer_range('Enter an integer: ', 1, 5))

    @mock.patch('src.user_input.read_string')
    def test_read_float_range(self, readstr):
        """Testing the read float range method"""
        readstr.side_effect = ['10.5', '3.3']
        self.assertEqual(3.3, read_float_range('Enter an float ', 1.5, 5.6))
