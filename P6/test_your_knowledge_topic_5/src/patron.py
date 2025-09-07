'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

import json
from datetime import datetime

from src.loan import Loan
import src.search as search

class Patron():
    '''
    Represents a patron of AAL.

    Every patron has:
    - an ID (unique across all patrons)
    - a name
    - an age (in years)
    - outstanding fees (fees before any discounts are applied)
    - record of gardening tool training (yes or no)
    - record of carpentry tool training (yes or no)
    - record of makerspace tool training (yes or no)
    - loans (list of Loan)
    '''
    def __init__(self):
        '''
        Initialise a new patron with no data.
        '''
        self._loans = []
        self._id = "NO DATA LOADED"
        self._name = "NO DATA LOADED"
        self._age = "NO DATA LOADED"
        self._outstanding_fees = "NO DATA LOADED"
        self._gardening_tool_training = "NO DATA LOADED"
        self._carpentry_tool_training = "NO DATA LOADED"
        self._makerspace_training = "NO DATA LOADED"

    def load_data(self, json_record, library_catalogue):
        '''
        Load information about a patron from JSON.
        Sets the patron's ID, name, age, outstanding fees, loans, and
        training completions.
        '''
        self._loans = self.load_loans(json_record["loans"], library_catalogue)
        self._id = int(json_record["patron_id"])
        self._name = json_record["name"]
        self._age = int(json_record["age"])
        self._outstanding_fees = float(json_record["outstanding_fees"])
        self._gardening_tool_training = bool(json_record["gardening_tool_training"])
        self._carpentry_tool_training = bool(json_record["carpentry_tool_training"])
        self._makerspace_training = bool(json_record["makerspace_training"])

    def load_loans(self, json_record, library_catalogue):
        '''
        Load information about a patron's loans from JSON.
        '''
        loans = []
        for loan_info in json_record:
            item_id = int(loan_info["item"])
            item = search.find_item_by_id(item_id, library_catalogue)
            if item is not None:
                due_date = datetime.strptime(loan_info["due"], '%d/%m/%Y')
                new_loan = Loan(item, due_date)
                loans.append(new_loan)

        return loans
    
    def find_loan(self, item_id):
        '''
        Search for a patron's loan of the specified item.
            Args:
                item_id (int): the ID of the item to search for.

            Returns:
                The Loan relating to that item if the patron has loaned
                the item with the ID, otherwise None.
        '''
        for l in self._loans:
            if l._item._id == item_id:
                return l
        return None

    def set_new_patron_data(self, id, name, age):
        '''
        Set the ID, name, and age of the patron to a chosen value.
        Set the outstanding fees to zero, and all training completions
        to false.
            Args:
                id (int): a unique ID for the patron.
                name (string): the patron's name.
                age (int): the patron's age in years.
        '''
        self._id = id
        self._name = name
        self._age = age
        self._outstanding_fees = 0.0
        self._gardening_tool_training = False
        self._carpentry_tool_training = False
        self._makerspace_training = False

    def __str__(self):
        '''
        Create and return a string representation of the patron.
        '''
        desc = [f"Patron {self._id}: {self._name} (aged {self._age})"]
        desc.append(f"Outstanding fees: ${self._outstanding_fees}")

        if not (self._gardening_tool_training or self._carpentry_tool_training or self._makerspace_training):
            desc.append("Completed training: NONE")
        else:
            desc.append("Completed training:")
            if self._gardening_tool_training:
                desc.append(" - gardening tools")
            if self._carpentry_tool_training:
                desc.append(" - carpentry tools")
            if self._makerspace_training:
                desc.append(" - makerspace")

        if len(self._loans) == 0:
            desc.append("No current loans")
        else:
            if len(self._loans) == 1:
                desc.append("1 active loan:")
            else:
                desc.append(f"{len(self._loans)} active loans:")
            for l in self._loans:
                desc.append(f" - {str(l)}")

        return "\n".join(desc)