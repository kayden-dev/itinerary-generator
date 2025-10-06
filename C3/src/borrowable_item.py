'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

import json

class BorrowableItem():
    '''
    Represents any item AAL can loan to patrons.

    Every borrowable item has:
    - an ID (unique across all items)
    - a name
    - a type (one of "Book", "Gardening tool", "Carpentry tool")
    - a year
    - a number owned by AAL
    - a number currently out on loan
    '''
    def __init__(self):
        '''
        Initialise a new borrowable item with no data.
        '''
        self._id = "NO DATA LOADED"
        self._name = "NO DATA LOADED"
        self._type = "NO DATA LOADED"
        self._year = "NO DATA LOADED"
        self._number_owned = "NO DATA LOADED"
        self._on_loan = "NO DATA LOADED"

    def load_data(self, json_record):
        '''
        Load information about a borrowable item from JSON.
        Sets the item's ID, name, type, year, number owned, and
        number on loan.
        '''
        self._id = int(json_record["item_id"])
        self._name = json_record["item_name"]
        self._type = json_record["item_type"]
        self._year = int(json_record["year"])
        self._number_owned = int(json_record["number_owned"])
        self._on_loan = int(json_record["on_loan"])

    def __str__(self):
        '''
        Create and return a string representation of the item.
        '''
        desc = [f"Item {self._id}: {self._name} ({self._type})"]
        desc.append(f"Year: {self._year}")
        desc.append(f"{self._on_loan}/{self._number_owned} on loan")

        return "\n".join(desc)