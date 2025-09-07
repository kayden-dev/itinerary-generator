import unittest

from src.calculator import Calculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        pass

    def test_initial_answer(self):
        calc = Calculator()
        self.assertEqual(0, calc.get_answer())