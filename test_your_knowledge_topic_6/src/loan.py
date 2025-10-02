'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

class Loan():
    '''
    Represents a loan held by one of AAL's patrons.
    Every loan has:
    - a borrowable item that has been loaned
    - a due date
    '''
    def __init__(self, item, due_date):
        '''
        Create a new loan.
            Args
                item (BorrowableItem): the item being borrowed
                due_date (datetime.Date): the date the item needs to be returned
        '''
        self._item = item
        self._due_date = due_date

    def __str__(self):
        '''
        Create and return a string representation of the loan.
        '''
        desc = f"Item {self._item._id}: {self._item._name} ({self._item._type}); due {self._due_date.strftime('%d/%m/%Y')}"

        return desc