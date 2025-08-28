# Student name: Kayden Nguyen
# Student ID: 33878935

import unittest

from src.calculator import Calculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        pass

    def test_initial_answer(self):
        calc = Calculator()
        self.assertEqual(0, calc.get_answer())

    def test_add(self):
        expected = 5
        c = Calculator()
        c.add(5)
        actual = c.get_answer()
        self.assertEqual(expected, actual, "Adding 5 to 0 should equal 5")

    def test_subtract(self):
        expected = -3
        c = Calculator()
        c.subtract(3)
        actual = c.get_answer()
        self.assertEqual(expected, actual, "Subtracting 3 from 0 should equal -3")