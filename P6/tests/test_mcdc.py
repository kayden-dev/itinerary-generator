# Student name: Kayden Nguyen
# Student ID: 33878935

import unittest

from src.mcdc import mcdc

class TestMcdc(unittest.TestCase):
  """
  6: A=F, B=T, C=F, D=T, Outcome=F
  10: A=T, B=F, C=F, D=T, Outcome=F
  12: A=T, B=F, C=T, D=T, Outcome=T
  13: A=T, B=T, C=F, D=F, Outcome=F
  14: A=T, B=T, C=F, D=T, Outcome=T
  """

  def setUp(self):
    pass

  def test_6(self):
    self.assertFalse(mcdc(False,True,False,True))
  
  def test_10(self):
    self.assertFalse(mcdc(True,False,False,True))

  def test_12(self):
    self.assertTrue(mcdc(True,False,True,True))

  def test_13(self):
    self.assertFalse(mcdc(True,True,False,False))

  def test_14(self):
    self.assertTrue(mcdc(True,True,False,True))