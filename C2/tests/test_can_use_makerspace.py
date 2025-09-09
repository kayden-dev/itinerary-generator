import unittest

from src.business_logic import can_use_makerspace

'''
Feasible paths:
1:135->148->150->151->153->155->157->158->159->161->164
2:135->148->150->151->153->155->157->158->159->161->162->164
3:135->148->150->151->153->155->156->161->164
4:135->148->150->151->153->154->161->164
'''

class TestCanUseMakerspace(unittest.TestCase):
  def setUp(self):
    pass

    # 1: 135->148->150->151->153->155->157->158->159->161->164
    def test_1(self):
        self.assertTrue(can_use_makerspace(30, 0.0, True))

    # 2: 135->148->150->151->153->155->157->158->159->161->162->164
    def test_2(self):
        self.assertFalse(can_use_makerspace(30, 10.0, True))

    # 3: 135->148->150->151->153->155->156->161->164
    def test_3(self):
        self.assertFalse(can_use_makerspace(12, 0.0, True))

    # 4: 135->148->150->151->153->154->161->164
    def test_4(self):
        self.assertFalse(can_use_makerspace(-1, 0.0, True))