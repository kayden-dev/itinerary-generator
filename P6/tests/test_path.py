# Student name: Kayden Nguyen
# Student ID: 33878935

import unittest

from src.path import calculate_discount

class TestPath(unittest.TestCase):
  """
  1: 1->2->3->5->6->8->13->14->15->19->20->22
  2: 1->2->3->5->6->8->13->14->16->17->19->20->22
  3: 1->2->3->5->6->8->13->19->20->22
  4: 1->2->3->5->6->8->9->10->19->20->22
  5: 1->2->3->5->6->8->9->11->12->19->20->22
  6: 1->2->3->5->8->13->14->15->19->22
  7: 1->2->3->5->8->13->14->16->17->19->22
  8: 1->2->3->5->8->13->19->22
  9: 1->2->3->5->8->9->10->19->22
  10: 1->2->3->5->8->9->11->12->19->22
  """
  def setUp(self):
    pass

  def test_1(self):
    self.assertEqual(calculate_discount(150,True,11),15)

  def test_2(self):
    self.assertEqual(calculate_discount(150, False, 11), 10)

  def test_3(self):
    self.assertEqual(calculate_discount(50, True, 11), 5)

  def test_4(self):
    self.assertEqual(calculate_discount(300, True, 11), 20)

  def test_5(self):
    self.assertEqual(calculate_discount(300, False, 11), 15)

  def test_6(self):
    self.assertEqual(calculate_discount(150, True, 10), 10)

  def test_7(self):
    self.assertEqual(calculate_discount(150, False, 10), 5)

  def test_8(self):
    self.assertEqual(calculate_discount(50, False, 10), 0)

  def test_9(self):
    self.assertEqual(calculate_discount(300, True, 10), 15)

  def test_10(self):
    self.assertEqual(calculate_discount(300, False, 10), 10)