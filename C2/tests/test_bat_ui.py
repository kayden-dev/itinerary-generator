import unittest
from unittest.mock import patch
from datetime import datetime
from src import bat_ui
from src.borrowable_item import BorrowableItem
from src.patron import Patron
from src.loan import Loan

class DM:
    def __init__(self):
        self._catalogue_data = []
        self._patron_data = []
    def save_patrons(self): pass
    def save_catalogue(self): pass
    def register_patron(self, name, age):
        p = Patron(); p.set_new_patron_data(len(self._patron_data)+1, name, age)
        self._patron_data.append(p)

def item(i, n, t, y=2020, own=2, on=0):
    it = BorrowableItem()
    it.load_data({"item_id": i, "item_name": n, "item_type": t, "year": y, "number_owned": own, "on_loan": on})
    return it

class TestBatUIMock(unittest.TestCase):
    def setUp(self):
        self.dm = DM()
        self.ui = bat_ui.BatUI(self.dm)

    @patch("builtins.input")
    def test_main_menu_to_quit(self, inp):
        inp.side_effect = ["999", "6"]
        self.ui.run_current_screen()
        self.ui.run_current_screen()
        self.assertEqual(self.ui.get_current_screen(), "QUIT")

    @patch("builtins.input")
    def test_loan_item_success(self, inp):
        self.dm._catalogue_data = [item(101, "Clean Code", "Book")]
        p = Patron(); p.set_new_patron_data(1, "Dev", 30)
        self.dm._patron_data = [p]
        inp.side_effect = ["101", "y", "Dev", "30", "7"]
        self.ui._loan_item()
        self.assertEqual(len(p._loans), 1)

    @patch("builtins.input")
    def test_return_item_success(self, inp):
        it = item(5, "Shovel", "Gardening tool")
        self.dm._catalogue_data = [it]
        p = Patron(); p.set_new_patron_data(1, "Dev", 30)
        p._loans = [Loan(it, datetime(2025, 1, 1))]
        self.dm._patron_data = [p]
        inp.side_effect = ["Dev", "30", "5"]
        self.ui._return_item()
        self.assertEqual(len(p._loans), 0)