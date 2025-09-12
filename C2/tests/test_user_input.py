import unittest
from src import user_input

class TestUserInput(unittest.TestCase):
    def setUp(self): pass

    def test_is_int_true(self):
        self.assertTrue(user_input.is_int("5"))

    def test_is_int_false(self):
        self.assertFalse(user_input.is_int("x"))

    def test_is_float_true(self):
        self.assertTrue(user_input.is_float("3.14"))

    def test_is_float_false(self):
        self.assertFalse(user_input.is_float("n"))
