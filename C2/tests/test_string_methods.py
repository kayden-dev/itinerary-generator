import unittest
from datetime import datetime
from src.borrowable_item import BorrowableItem
from src.loan import Loan
from src.patron import Patron

def item(i, n, t, y=2019, own=3, on=1):
    it = BorrowableItem()
    it.load_data({"item_id": i, "item_name": n, "item_type": t, "year": y, "number_owned": own, "on_loan": on})
    return it

class TestStringMethods(unittest.TestCase):
    def setUp(self): pass

    def test_item_str_header(self):
        s = str(item(7, "Hammer", "Carpentry tool"))
        self.assertIn("Item 7: Hammer (Carpentry tool)", s)

    def test_item_str_year(self):
        s = str(item(7, "Hammer", "Carpentry tool"))
        self.assertIn("Year: 2019", s)

    def test_item_str_ratio(self):
        s = str(item(7, "Hammer", "Carpentry tool"))
        self.assertIn("1/3 on loan", s)

    def test_loan_str_date(self):
        it = item(7, "Hammer", "Carpentry tool")
        ln = Loan(it, datetime(2025, 1, 2))
        self.assertIn("due 02/01/2025", str(ln))

    def test_patron_str_header(self):
        p = Patron()
        p.set_new_patron_data(1, "A", 30)
        self.assertIn("Patron 1: A", str(p))

    def test_patron_str_training_flags(self):
        p = Patron()
        p.set_new_patron_data(1, "A", 30)
        p._gardening_tool_training = True
        p._makerspace_training = True
        self.assertIn("- makerspace", str(p))

    def test_patron_str_loans_count(self):
        p = Patron()
        p.set_new_patron_data(1, "A", 30)
        it = item(5, "Shovel", "Gardening tool", 2020, 2, 2)
        p._loans = [Loan(it, datetime(2025, 3, 4))]
        self.assertIn("1 active loan:", str(p))