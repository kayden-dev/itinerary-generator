'''
The method you are testing is:
    can_borrow(item_type, patron_age, length_of_loan, outstanding_fees, gardening_training, carpentry_training)

The data type of each parameter is:
- item_type: string
- patron_age: integer
- length_of_loan: integer
- outstanding_fees: float
- gardening_training: boolean
- carpentry_training: boolean

You can assume that the can_borrow method is already imported into this python module,
so you can call "can_borrow" directly.

Author: Kayden Nguyen
Student ID: 33878935
'''

import unittest
class TestCanBorrow(unittest.TestCase):
  def test_1(self):
    # Patron age 18-89, borrowing a book, for a short length,
    # with outstanding fees, with both trainings
    expected = False
    actual = can_borrow("book", 50, 2, 10.32, True, True)
    self.assertEqual(
        expected, actual,
        "Patron age 50 borrowing a book for 1 day with $10.32 in outstanding fees and both trainings shouldn't be able to borrow"
    )

  def test_2(self):
    # Patron age 18-89, borrowing a carpentry tool, for a long length,
    # with no outstanding fees, with no trainings
    expected = False  # carpentry requires carpentry training
    actual = can_borrow("carpentry", 50, 14, 0.00, False, False)
    self.assertEqual(
        expected, actual,
        "Carpentry (no training) should be denied even with no fees"
    )

  def test_3(self):
    # Patron age <18 borrowing a gardening tool, for a medium length,
    # with outstanding fees, with no training
    expected = False  # fees block; also missing gardening training
    actual = can_borrow("gardening", 17, 7, 10.32, False, False)
    self.assertEqual(expected, actual, "Fees owed should block borrowing")

  def test_4(self):
    # Patron age <18 borrowing a gardening tool, for a short length,
    # with no outstanding fees, with gardening training
    expected = True  # minors can borrow gardening tools if trained
    actual = can_borrow("gardening", 17, 2, 0.00, True, False)
    self.assertEqual(expected, actual, "Trained minor should be allowed for gardening")

  def test_5(self):
    # Patron age >=90 borrowing a carpentry tool, for a medium length,
    # with outstanding fees, with gardening training
    expected = False  # age >=90 cannot borrow carpentry (age ban)
    actual = can_borrow("carpentry", 92, 7, 10.32, True, False)
    self.assertEqual(expected, actual, "Age >=90 should be denied for carpentry regardless of fees/training")

  def test_6(self):
    # Patron age >=90 borrowing a book, for a short length,
    # with no outstanding fees, with carpentry training
    expected = True  # books allowed; training irrelevant
    actual = can_borrow("book", 92, 2, 0.00, False, True)
    self.assertEqual(expected, actual, "Senior should be allowed to borrow books")

  def test_7(self):
    # Patron age <18 borrowing a gardening tool, for a long length,
    # with outstanding fees, with carpentry training
    expected = False  # fees block; wrong training
    actual = can_borrow("gardening", 17, 14, 10.32, False, True)
    self.assertEqual(expected, actual, "Fees owed should block; also wrong training for gardening")

  def test_8(self):
    # Patron age 18-89 borrowing a book, for a medium length,
    # with no outstanding fees, with carpentry training
    expected = True  # books allowed; training irrelevant
    actual = can_borrow("book", 50, 7, 0.00, False, True)
    self.assertEqual(expected, actual, "Adult with no fees should be allowed to borrow books")

  def test_9(self):
    # Patron age >=90 borrowing a gardening tool, for a long length,
    # with no outstanding fees, with both trainings
    expected = True  # gardening allowed if gardening training present (Both includes it)
    actual = can_borrow("gardening", 92, 14, 0.00, True, True)
    self.assertEqual(expected, actual, "Senior with training should be allowed for gardening")

  def test_10(self):
    # Patron age 18-89 borrowing a book, for a long length,
    # with no outstanding fees, with gardening training
    expected = True  # books allowed; training irrelevant
    actual = can_borrow("book", 50, 14, 0.00, True, False)
    self.assertEqual(expected, actual, "Adult with no fees should be allowed to borrow books")

  def test_11(self):
    # Patron age <18 borrowing a carpentry tool, for a short length,
    # with outstanding fees, with carpentry training
    expected = False  # under-18 carpentry age ban (fees irrelevant)
    actual = can_borrow("carpentry", 17, 2, 10.32, False, True)
    self.assertEqual(expected, actual, "Under-18 should be denied carpentry regardless of training/fees")

  def test_12(self):
    # Patron age >=90 borrowing a book, for a short length,
    # with no outstanding fees, with no training
    expected = True  # books allowed
    actual = can_borrow("book", 92, 2, 0.00, False, False)
    self.assertEqual(expected, actual, "Senior should be allowed to borrow books")

  def test_13(self):
    # Patron age <18 borrowing a book, for a medium length,
    # with no outstanding fees, with both trainings
    expected = True  # books allowed to minors
    actual = can_borrow("book", 17, 7, 0.00, True, True)
    self.assertEqual(expected, actual, "Minor should be allowed to borrow books")

  def test_14(self):
    # Patron age 18-89 borrowing a gardening tool, for a short length,
    # with outstanding fees, with both trainings
    expected = False  # fees block (for <90)
    actual = can_borrow("gardening", 50, 2, 10.32, True, True)
    self.assertEqual(expected, actual, "Outstanding fees should block borrowing for adults")

  def test_15(self):
    # Patron age <18 borrowing a carpentry tool, for a short length,
    # with outstanding fees, with both trainings
    expected = False  # under-18 carpentry age ban
    actual = can_borrow("carpentry", 17, 2, 10.32, True, True)
    self.assertEqual(expected, actual, "Under-18 should be denied carpentry regardless of training/fees")
