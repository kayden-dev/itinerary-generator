"""Module used to test the calculator class"""


import unittest

from src.calculator import Calculator

class TestCalculator(unittest.TestCase):
  """Class used to test the calculator class"""

  def setUp(self):
    pass

  def test_initial_answer(self):
    """Testing that the initial value is 0 for the calculator"""
    calc = Calculator()
    self.assertEqual(0, calc.get_answer())
