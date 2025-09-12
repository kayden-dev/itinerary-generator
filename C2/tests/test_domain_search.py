import unittest
from datetime import datetime
from src.borrowable_item import BorrowableItem
from src.loan import Loan
from src.patron import Patron
from src import search

def item(i, n, t, y=2019, own=3, on=1):
    it = BorrowableItem()
    it.load_data({"item_id": i, "item_name": n, "item_type": t, "year": y, "number_owned": own, "on_loan": on})
    return it

class TestDomainSearch(unittest.TestCase):
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

    def test_find_loan_hit(self):
        p = Patron()
        p.set_new_patron_data(1, "A", 30)
        it = item(5, "Shovel", "Gardening tool")
        p._loans = [Loan(it, datetime(2025, 3, 4))]
        self.assertIsNotNone(p.find_loan(5))

    def test_find_loan_miss(self):
        p = Patron()
        p.set_new_patron_data(1, "A", 30)
        self.assertIsNone(p.find_loan(9999))

    def test_find_item_by_id_hit(self):
        i1 = item(1, "S", "Gardening tool", 2000, 1, 0)
        i2 = item(2, "Saw", "Carpentry tool", 2001, 1, 0)
        self.assertIs(search.find_item_by_id(2, [i1, i2]), i2)

    def test_find_item_by_id_miss(self):
        i1 = item(1, "S", "Gardening tool", 2000, 1, 0)
        self.assertIsNone(search.find_item_by_id(9, [i1]))

    def test_find_patron_by_name(self):
        a = Patron(); a.set_new_patron_data(1, "A", 30)
        b = Patron(); b.set_new_patron_data(2, "B", 30)
        c = Patron(); c.set_new_patron_data(3, "B", 20)
        self.assertEqual(search.find_patron_by_name("B", [b, c]), [b, c])

    def test_find_patron_by_name_and_age(self):
        a = Patron(); a.set_new_patron_data(1, "A", 30)
        b = Patron(); b.set_new_patron_data(2, "B", 30)
        c = Patron(); c.set_new_patron_data(3, "B", 20)
        self.assertIs(search.find_patron_by_name_and_age("B", 30, [a, b, c]), b)

    def test_find_patron_by_age(self):
        a = Patron(); a.set_new_patron_data(1, "A", 30)
        b = Patron(); b.set_new_patron_data(2, "B", 30)
        c = Patron(); c.set_new_patron_data(3, "B", 20)
        self.assertEqual(search.find_patron_by_age(30, [a, b, c]), [a, b])
