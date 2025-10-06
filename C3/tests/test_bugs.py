import unittest
from unittest import mock
from src.bat_ui import BatUI
from src import data_mgmt, search


class TestBatBugs(unittest.TestCase):

    def setUp(self):
        """Instantiate a BatUI backed by the real data manager."""
        self.dm = data_mgmt.DataManager()
        self.ui = BatUI(self.dm)

    @mock.patch('builtins.input')
    def test_loan_decrement(self, inp):
        """Verify return processing decrements the item's loan count."""
        item_id = 1
        item = search.find_item_by_id(item_id, self.dm._catalogue_data)
        initial_on_loan = item._on_loan

        inp.side_effect = ["2", "John Doe", "95", str(item_id)]
        self.ui.run_current_screen()
        self.ui.run_current_screen()

        updated_item = search.find_item_by_id(item_id, self.dm._catalogue_data)
        self.assertEqual("MAIN MENU", self.ui.get_current_screen())
        self.assertEqual(initial_on_loan - 1, updated_item._on_loan)
