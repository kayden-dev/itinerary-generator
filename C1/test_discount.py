'''
The method you are testing is:
    calculate_discount(age)

The data type of each parameter is:
- age: integer

You can assume that the calculate_discount method is already imported into this python module,
so you can call "calculate_discount" directly.

Author: Kayden Nguyen
Student ID: 33878935
'''

import unittest

class TestDiscounts(unittest.TestCase):
  def test_age_25(self):
    expected = 0
    actual = calculate_discount(25)
    self.assertEqual(expected, actual, "Patron age 25 should not get discount")

  def test_age_49(self):
    expected = 0
    actual = calculate_discount(49)
    self.assertEqual(expected, actual, "Patron age 49 should not get discount")

  def test_age_50(self):
    expected = 0
    actual = calculate_discount(50)
    self.assertEqual(expected, actual, "Patron age 50 should not get discount")

  def test_age_51(self):
    expected = 10
    actual = calculate_discount(51)
    self.assertEqual(expected, actual, "Patron age 51 should get a discount of 10%")

  def test_age_55(self):
    expected = 10
    actual = calculate_discount(55)
    self.assertEqual(expected, actual, "Patron age 55 should get a discount of 10%")

  def test_age_64(self):
    expected = 10
    actual = calculate_discount(64)
    self.assertEqual(expected, actual, "Patron age 64 should get a discount of 10%")

  def test_age_65(self):
    expected = 15
    actual = calculate_discount(65)
    self.assertEqual(expected, actual, "Patron age 65 should get a discount of 15%")

  def test_age_66(self):
    expected = 15
    actual = calculate_discount(66)
    self.assertEqual(expected, actual, "Patron age 66 should get a discount of 15%")

  def test_age_80(self):
    expected = 15
    actual = calculate_discount(80)
    self.assertEqual(expected, actual, "Patron age 80 should get a discount of 15%")

  def test_age_89(self):
    expected = 15
    actual = calculate_discount(89)
    self.assertEqual(expected, actual, "Patron age 89 should get a discount of 15%")

  def test_age_90(self):
    expected = 100
    actual = calculate_discount(90)
    self.assertEqual(expected, actual, "Patron age 90 should get a discount of 100%")

  def test_age_91(self):
    expected = 100
    actual = calculate_discount(91)
    self.assertEqual(expected, actual, "Patron age 91 should get a discount of 100%")

  def test_age_100(self):
    expected = 100
    actual = calculate_discount(100)
    self.assertEqual(expected, actual, "Patron age 100 should get a discount of 100%")
