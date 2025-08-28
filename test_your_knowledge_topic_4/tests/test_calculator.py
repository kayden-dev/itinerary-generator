# Student name: Kayden Nguyen
# Student ID: 33878935

import unittest

from calculator import Calculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        pass

    def test_initial_answer(self):
        calc = Calculator()
        self.assertEqual(0, calc.get_answer(),"Initial answer should be 0")