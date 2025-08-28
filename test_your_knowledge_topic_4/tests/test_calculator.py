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

    def test_multiply(self):
        expected = 0
        c = Calculator()
        c.multiply(10)
        actual = c.get_answer()
        self.assertEqual(expected, actual, "Multiplying 0 by 10 should equal 0")

    def test_power(self):
        expected = 16
        c = Calculator()
        c.add(2).power(4)  # (0+2)^4
        actual = c.get_answer()
        self.assertEqual(expected, actual, "2 raised to the power of 4 should equal 16")

    def test_reset(self):
        expected = 0
        self.c.add(5).multiply(10).reset()
        actual = self.c.get_answer()
        self.assertEqual(expected, actual, "Reset should bring answer back to 0")
        