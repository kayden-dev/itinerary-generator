import unittest
from unittest import mock
from src.bat_ui import BatUI
from src import data_mgmt


class TestBatUIMock(unittest.TestCase):
    def setUp(self):
        self.dm = data_mgmt.DataManager()
        self.ui = BatUI(self.dm)

    def test_main_menu(self):
        self.assertEqual('MAIN MENU', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_loan_item(self, inp):
        inp.side_effect = ['0', '1']
        self.ui.run_current_screen()
        self.assertEqual('LOAN ITEM', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_return_item(self, inp):
        inp.side_effect = ['0', '2']
        self.ui.run_current_screen()
        self.assertEqual('RETURN ITEM', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_search_for_patron(self, inp):
        inp.side_effect = ['0', '3']
        self.ui.run_current_screen()
        self.assertEqual('SEARCH FOR PATRON', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_register_patron(self, inp):
        inp.side_effect = ['0', '4']
        self.ui.run_current_screen()
        self.assertEqual('REGISTER PATRON', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_access_makerspace(self, inp):
        inp.side_effect = ['0', '5']
        self.ui.run_current_screen()
        self.assertEqual('ACCESS MAKERSPACE', self.ui.get_current_screen())
  
    @mock.patch('builtins.input')
    def test_quit(self, inp):
        inp.side_effect = ['0', '6']
        self.ui.run_current_screen()
        self.assertEqual('QUIT', self.ui.get_current_screen())
