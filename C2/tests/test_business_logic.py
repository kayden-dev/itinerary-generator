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
        # No shared fixtures are required at this stage.
        pass

    def test_type_error(self):
        # Negative ages should be classified as invalid.
        self.assertEqual(type_of_patron(-1), "ERROR")

    def test_type_minor(self):
        # Young patrons must be identified as minors.
        self.assertEqual(type_of_patron(0), "Minor")

    def test_type_adult(self):
        # Adults begin at age 18.
        self.assertEqual(type_of_patron(18), "Adult")

    def test_type_elderly(self):
        # Elders are patrons aged 90 or above.
        self.assertEqual(type_of_patron(90), "Elderly")

    def test_disc_error(self):
        # Negative fees should trigger an error path.
        self.assertEqual(calculate_discount(-5), "ERROR")

    def test_disc_0(self):
        # Fees below the discount bracket remain unchanged.
        self.assertEqual(calculate_discount(49), 0)

    def test_disc_10(self):
        # Patrons between 50 and 64 inclusive receive a 10% discount.
        self.assertEqual(calculate_discount(50), 10)

    def test_disc_15(self):
        # Patrons 65 or older are given a 15% reduction.
        self.assertEqual(calculate_discount(65), 15)

    def test_disc_100(self):
        # Patrons aged 90+ do not pay any fees at all.
        self.assertEqual(calculate_discount(90), 100)

    def test_allow_55_days(self):
        # A medium-length book loan within limits should be allowed.
        self.assertTrue(can_borrow_book(30, 55, 0.0))

    def test_deny_57_days(self):
        # Book loans exceeding the maximum days must be rejected.
        self.assertFalse(can_borrow_book(30, 57, 0.0))

    def test_deny_with_fees(self):
        # Outstanding fees prevent additional book borrowing.
        self.assertFalse(can_borrow_book(40, 7, 5.0))

    def test_allow_elderly_discount(self):
        # Elder patrons with waived fees can still borrow.
        self.assertTrue(can_borrow_book(95, 7, 5))

    def test_allow_trained_28(self):
        # Trained adults may borrow gardening tools for less than 29 days.
        self.assertTrue(can_borrow_gardening_tool(25, 28, 0.0, True))

    def test_deny_len_29(self):
        # Gardening tool loans over the day limit are denied.
        self.assertFalse(can_borrow_gardening_tool(25, 29, 0.0, True))

    def test_deny_untrained(self):
        # Training is required before borrowing gardening tools.
        self.assertFalse(can_borrow_gardening_tool(25, 7, 0.0, False))

    def test_deny_fees(self):
        # Gardening tools cannot be borrowed when fees are outstanding.
        self.assertFalse(can_borrow_gardening_tool(70, 7, 5.0, True))

    def test_allow_90_discount(self):
        # Seniors over 90 should have their fees ignored when borrowing tools.
        self.assertTrue(can_borrow_gardening_tool(90, 7, 5.0, True))

    def test_allow_trained_14(self):
        # Trained patrons can borrow carpentry tools for up to two weeks.
        self.assertTrue(can_borrow_carpentry_tool(25, 14, 0.0, True))

    def test_deny_len_15(self):
        # Carpentry loans beyond 14 days must be rejected.
        self.assertFalse(can_borrow_carpentry_tool(25, 15, 0.0, True))

    def test_deny_untrained(self):
        # Training is mandatory before borrowing carpentry tools.
        self.assertFalse(can_borrow_carpentry_tool(25, 7, 0.0, False))

    def test_deny_minor(self):
        # Minors cannot borrow carpentry equipment regardless of training.
        self.assertFalse(can_borrow_carpentry_tool(17, 7, 0.0, True))

    def test_deny_fees(self):
        # Carpentry loans are blocked if the patron owes fees.
        self.assertFalse(can_borrow_carpentry_tool(40, 7, 3.0, True))

    def test_deny_90_not_adult(self):
        # Patrons over 90 are treated similarly to minors for carpentry tools.
        self.assertFalse(can_borrow_carpentry_tool(90, 7, 12.0, True))
