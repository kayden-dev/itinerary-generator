'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

import json
import sys

from src.patron import Patron
from src.borrowable_item import BorrowableItem
import src.config as config

class DataManager():
    '''
    Manages catalogue and patron data.
    '''
    def __init__(self):
        '''
        Create a new data manager, loading catalogue and patron data
        from the files specified in the software configuration.
        '''
        self._catalogue_data = None
        self.load_catalogue()
        self._patron_data = None
        self.load_patrons()

    def register_patron(self, patron_name, patron_age):
        '''
        Register a new patron.
        It is assumed that the name and age combination is unique with
        respect to any existing data.
        The patron is assigned a unique ID, and initialised with zero loans
        and no training completed.
            Args:
                patron_name (string): the patron's name.
                patron_age (int): the patron's age in years.
        '''
        next_id = max(self._patron_data, key=lambda p: p._id)._id + 1

        new_patron = Patron()
        new_patron.set_new_patron_data(next_id, patron_name, patron_age)

        self._patron_data.append(new_patron)

    def load_patrons(self):
        '''
        Load patron data from the file specified in config.
        If there is an error loading the data, print an error message
        and crash the program.
        '''
        try:
            with open(config.PATRON_DATA, 'r') as f:
                data = json.load(f)

            patrons = []
            for d in data:
                new_patron = Patron()
                new_patron.load_data(d, self._catalogue_data)
                patrons.append(new_patron)

            self._patron_data = patrons
        except:
            print("ERROR LOADING PATRON DATA: EXITING.")
            sys.exit()

    def save_patrons(self):
        '''
        Save patron data to the file specified in config.
        Overrites any existing data.
        '''
        with open(config.PATRON_DATA, 'w') as f:
            f.write("[")
            for p in self._patron_data:
                f.write(json.dumps(p, cls=self.PatronEncoder))
                if p != self._patron_data[-1]:
                    f.write(",")
            f.write("]")

    def load_catalogue(self):
        '''
        Load catalogue data from the file specified in config.
        If there is an error loading the data, print an error message
        and crash the program.
        '''
        try:
            with open(config.CATALOGUE_DATA, 'r') as f:
                data = json.load(f)

            items = []
            for d in data:
                new_item = BorrowableItem()
                new_item.load_data(d)
                items.append(new_item)

            self._catalogue_data = items
        except:
            print("ERROR LOADING CATALOGUE DATA: EXITING.")
            sys.exit()

    def save_catalogue(self):
        '''
        Save catalogue data to the file specified in config.
        Overrites any existing data.
        '''
        with open(config.CATALOGUE_DATA, 'w') as f:
            f.write("[")
            for d in self._catalogue_data:
                f.write(json.dumps(d, cls=self.BorrowableItemEncoder))
                if d != self._catalogue_data[-1]:
                    f.write(",")
            f.write("]")

    class PatronEncoder(json.JSONEncoder):
        '''
        Translates instances of the Patron class to JSON for
        saving to file.
        '''
        def default(self, obj):
            if isinstance(obj, Patron):
                return {
                    "patron_id": obj._id,
                    "name": obj._name,
                    "age": obj._age,
                    "outstanding_fees": obj._outstanding_fees,
                    "gardening_tool_training": obj._gardening_tool_training,
                    "carpentry_tool_training": obj._carpentry_tool_training,
                    "makerspace_training": obj._makerspace_training,
                    "loans" : [{"item": l._item._id,"due": l._due_date.strftime('%d/%m/%Y')} for l in obj._loans]
                }
            return super().default(obj)

    class BorrowableItemEncoder(json.JSONEncoder):
        '''
        Translates instances of the BorrowableItem class to JSON for
        saving to file.
        '''
        def default(self, obj):
            if isinstance(obj, BorrowableItem):
                return {
                    "item_id": obj._id,
                    "item_name": obj._name,
                    "item_type": obj._type,
                    "year": obj._year,
                    "number_owned": obj._number_owned,
                    "on_loan": obj._on_loan,
                }
            return super().default(obj)