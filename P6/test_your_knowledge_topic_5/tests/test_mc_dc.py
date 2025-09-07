import unittest

from src.business_logic import can_borrow_carpentry_tool

'''
Possible tests:
Conditions: 
A: fees_owed > 0
B: patron_age <= 18
C: patron_age >= 90

Tests
#,A,B,C,R
1,F,F,F,T
2,F,F,T,F
3,F,T,F,F
4,F,T,T,F
5,T,F,F,F
6,T,F,T,F
7,T,T,F,F
8,T,T,T,F

Possible optimal sets of tests using MC/DC: 
{1,2,3,5}

Set chosen:
{1,2,3,5} 
'''

class TestCanBorrowCartpentryTool(unittest.TestCase):
  def setUp(self):
    pass

  # 1: A=F, B=F, C=F  -> True
  # fees_owed == 0, 19<=age<=89
  def test_1(self):
      self.assertFalse(can_borrow_carpentry_tool(30, 7, 0.0, True))

  # 2: A=F, B=F, C=T  -> False (age >= 90)
  def test_2(self):
      self.assertFalse(can_borrow_carpentry_tool(90, 7, 0.0, True))

  # 3: A=F, B=T, C=F  -> False (age <= 18)
  def test_3(self):
      self.assertFalse(can_borrow_carpentry_tool(18, 7, 0.0, True))
  
  # 5: A=T, B=F, C=F  -> False (fees_owed > 0)
  def test_5(self):
      self.assertFalse(can_borrow_carpentry_tool(30, 7, 10.0, True))