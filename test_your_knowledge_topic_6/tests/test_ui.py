"""Tests for the BatUI navigation flow."""

import unittest
from unittest import mock
from src.bat_ui import BatUI
from src import data_mgmt


class TestBatUIMock(unittest.TestCase):
    """Validate screen transitions while interacting with BatUI."""

    def setUp(self):
        """Instantiate a BatUI backed by the real data manager."""
        self.dm = data_mgmt.DataManager()
        self.ui = BatUI(self.dm)

    def test_main_menu(self):
        """BatUI starts on the main menu screen."""
        self.assertEqual('MAIN MENU', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_loan_item(self, inp):
        """Navigate from the main menu to the loan item screen."""
        inp.side_effect = ['0', '1']
        self.ui.run_current_screen()
        self.assertEqual('LOAN ITEM', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_return_item(self, inp):
        """Navigate from the main menu to the return item screen."""
        inp.side_effect = ['0', '2']
        self.ui.run_current_screen()
        self.assertEqual('RETURN ITEM', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_search_for_patron(self, inp):
        """Navigate from the main menu to the search for patron screen."""
        inp.side_effect = ['0', '3']
        self.ui.run_current_screen()
        self.assertEqual('SEARCH FOR PATRON', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_register_patron(self, inp):
        """Navigate from the main menu to the register patron screen."""
        inp.side_effect = ['0', '4']
        self.ui.run_current_screen()
        self.assertEqual('REGISTER PATRON', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_access_makerspace(self, inp):
        """Navigate from the main menu to the access makerspace screen."""
        inp.side_effect = ['0', '5']
        self.ui.run_current_screen()
        self.assertEqual('ACCESS MAKERSPACE', self.ui.get_current_screen())

    @mock.patch('builtins.input')
    def test_quit(self, inp):
        """Navigate from the main menu to the quit screen."""
        inp.side_effect = ['0', '6']
        self.ui.run_current_screen()
        self.assertEqual('QUIT', self.ui.get_current_screen())
