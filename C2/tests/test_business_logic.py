import unittest

from src.business_logic import (
    type_of_patron,
    calculate_discount,
    can_borrow_book,
    can_borrow_gardening_tool,
    can_borrow_carpentry_tool,
    can_borrow,
    can_use_makerspace,
    process_loan,
    process_return,
)
from src.patron import Patron
from src.borrowable_item import BorrowableItem
from src.loan import Loan

class TestBusinessLogic(unittest.TestCase):
    def setUp(self):
      pass
    def test_type_error(self): self.assertEqual(type_of_patron(-1), "ERROR")
    def test_type_minor(self): self.assertEqual(type_of_patron(0), "Minor")
    def test_type_adult(self): self.assertEqual(type_of_patron(18), "Adult")
    def test_type_elderly(self): self.assertEqual(type_of_patron(90), "Elderly")
    def test_disc_error(self): self.assertEqual(calculate_discount(-5), "ERROR")
    def test_disc_0(self): self.assertEqual(calculate_discount(49), 0)
    def test_disc_10(self): self.assertEqual(calculate_discount(50), 10)
    def test_disc_15(self): self.assertEqual(calculate_discount(65), 15)
    def test_disc_100(self): self.assertEqual(calculate_discount(90), 100)
    def test_allow_55_days(self): self.assertTrue(can_borrow_book(30, 55, 0.0))
    def test_deny_57_days(self): self.assertFalse(can_borrow_book(30, 57, 0.0))
    def test_deny_with_fees(self): self.assertFalse(can_borrow_book(40, 7, 5.0))
    def test_allow_elderly_discount(self): self.assertTrue(can_borrow_book(95, 7, 5))
    def test_allow_trained_28(self): self.assertTrue(can_borrow_gardening_tool(25, 28, 0.0, True))
    def test_deny_len_29(self): self.assertFalse(can_borrow_gardening_tool(25, 29, 0.0, True))
    def test_deny_untrained(self): self.assertFalse(can_borrow_gardening_tool(25, 7, 0.0, False))
    def test_deny_fees(self): self.assertFalse(can_borrow_gardening_tool(70, 7, 5.0, True))
    def test_allow_90_discount(self): self.assertTrue(can_borrow_gardening_tool(90, 7, 5.0, True))
    def test_allow_trained_14(self): self.assertTrue(can_borrow_carpentry_tool(25, 14, 0.0, True))
    def test_deny_len_15(self): self.assertFalse(can_borrow_carpentry_tool(25, 15, 0.0, True))
    def test_deny_untrained(self): self.assertFalse(can_borrow_carpentry_tool(25, 7, 0.0, False))
    def test_deny_minor(self): self.assertFalse(can_borrow_carpentry_tool(17, 7, 0.0, True))
    def test_deny_fees(self): self.assertFalse(can_borrow_carpentry_tool(40, 7, 3.0, True))
    def test_deny_90_not_adult(self): self.assertFalse(can_borrow_carpentry_tool(90, 7, 12.0, True))