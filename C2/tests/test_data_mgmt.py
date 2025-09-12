import unittest
from src import data_mgmt

class TestDataMgmt(unittest.TestCase):
    def setUp(self): pass

    def test_register_increases_count(self):
        dm = data_mgmt.DataManager()
        n = len(dm._patron_data)
        dm.register_patron("Yara", 22)
        self.assertEqual(len(dm._patron_data), n + 1)

    def test_save_catalogue_returns_none(self):
        dm = data_mgmt.DataManager()
        self.assertIsNone(dm.save_catalogue())

    def test_save_patrons_returns_none(self):
        dm = data_mgmt.DataManager()
        self.assertIsNone(dm.save_patrons())
