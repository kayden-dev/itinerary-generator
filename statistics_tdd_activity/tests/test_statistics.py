import unittest

from src.statistics import *

class TestStatistics(unittest.TestCase):
    def test_sum_positives(self):
        expected = 21
        actual = sum([1,2,3,4,5,6])
        self.assertEqual(expected,actual,"Summing 1-6 should equal 21")

    def test_sum_negatives(self):
        expected = -21
        actual = sum([-1,-2,-3,-4,-5,-6])
        self.assertEqual(expected,actual,"Summing 1-6 (negative) should equal -21")

    def test_sum_mixed(self):
        expected = 9
        actual = sum([1,-2,3,-4,5,6])
        self.assertEqual(expected,actual,"Summing [1,-2,3,-4,5,6] should equal 9")