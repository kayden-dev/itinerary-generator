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

    def test_mean_positives(self):
        expected = 3.5
        actual = mean([1,2,3,4,5,6])
        self.assertEqual(expected, actual, "Mean of 1-6 should equal 3.5")

    def test_mean_negatives(self):
        expected = -3.5
        actual = mean([-1,-2,-3,-4,-5,-6])
        self.assertEqual(expected, actual, "Mean of -1 to -6 should equal -3.5")

    def test_mean_mixed(self):
        expected = 1.5
        actual = mean([1,-2,3,-4,5,6])
        self.assertEqual(expected, actual, "Mean of [1,-2,3,-4,5,6] should equal 1.5")

    def test_minimum_positives(self):
        expected = 1
        actual = minimum([1,2,3,4,5,6])
        self.assertEqual(expected, actual, "Min of 1-6 should equal 1")

    def test_minimum_negatives(self):
        expected = -6
        actual = minimum([-1,-2,-3,-4,-5,-6])
        self.assertEqual(expected, actual, "Min of -1 to -6 should equal -6")

    def test_minimum_mixed(self):
        expected = -4
        actual = minimum([1,-2,3,-4,5,6])
        self.assertEqual(expected, actual, "Min of [1,-2,3,-4,5,6] should equal -4")

    def test_maximum_positives(self):
        expected = 6
        actual = maximum([1,2,3,4,5,6])
        self.assertEqual(expected, actual, "Max of 1-6 should equal 6")

    def test_maximum_negatives(self):
        expected = -1
        actual = maximum([-1,-2,-3,-4,-5,-6])
        self.assertEqual(expected, actual, "Max of -1 to -6 should equal -1")

    def test_maximum_mixed(self):
        expected = 6
        actual = maximum([1,-2,3,-4,5,6])
        self.assertEqual(expected, actual, "Max of [1,-2,3,-4,5,6] should equal 6")

