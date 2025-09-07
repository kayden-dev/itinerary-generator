'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

import src.user_input as user_input
import src.data_mgmt as data_mgmt
import src.search as search
import src.business_logic as logic
from src.patron import Patron

class BatUI():
    '''
    This class manages the UI screens of BAT and the transitions between them.
    '''

    def __init__(self, data_manager):
        '''
        Create a new instance of the UI. The initial screen will be
        set to the main menu screen.

            Args:
                data_manager (DataManager): a data manager with patron
                    and catalogue data loaded.
        '''
        self._current_screen = self._main_menu
        self._data_manager = data_manager

    def get_current_screen(self):
        '''
        Retrieve the current menu screen.

            Returns:
                A string representation of the current menu screen. Possible values are
                "MAIN MENU", "LOAN ITEM", "RETURN ITEM", "SEARCH FOR PATRON", "REGISTER PATRON",
                "ACCESS MAKERSPACE", and "QUIT".
        '''
        match self._current_screen:
            case self._main_menu:
                return "MAIN MENU"
            case self._loan_item:
                return "LOAN ITEM"
            case self._return_item:
                return "RETURN ITEM"
            case self._search_for_patron:
                return "SEARCH FOR PATRON"
            case self._register_patron:
                return "REGISTER PATRON"
            case self._access_makerspace:
                return "ACCESS MAKERSPACE"
            case self._quit:
                return "QUIT"

    def run_current_screen(self):
        '''
        Run the current menu screen. If necessary, transition to a new menu screen.
        '''
        self._current_screen = self._current_screen()

    def _main_menu(self):
        '''
        The main menu screen of BAT. Presents the user with 6 options (loan item, return
        item, search for patron, register patron, validate makerspace access, and quit),
        and transitions to the menu screen the user selects.

        Keeps asking the user for a selection until the enter a valid choice.
        '''
        print("""
            ------------------------------------------
            | BAT: Borrowing Administration Terminal |
            ------------------------------------------

            1. Loan Item
            2. Return Item
            3. Search for Patron
            4. Register Patron
            5. Validate Makerspace Access
            6. Quit
            """)
        
        choice = user_input.read_integer_range('Enter your choice: ', 1, 6)

        match choice:
            case 1:
                return self._loan_item
            case 2:
                return self._return_item
            case 3:
                return self._search_for_patron
            case 4:
                return self._register_patron
            case 5:
                return self._access_makerspace
            case 6:
                return self._quit
            case _:
                return self._main_menu

    def _loan_item(self):
        '''
        The loan item menu screen of BAT. Follows the process:
        - ask the user for the ID of the item to be loaned
        - ask the user to confirm if that is the correct item
        - ask the user for the name and age of the patron loaning the item
        - ask the user for the length of the loan in days (from 1 - 365 inclusive)
        - loan the item if the specified user is allowed to loan the specified item

        If the process fails at any point (e.g., an item with the given ID can't
        be found in the catalogue, a patron with the given name and age can't be
        found in the patron database), return to the main menu screen.

        If the loan is successfully processed, print a message then return to the
        main menu screen.
        '''
        print("""
            ------------------
            | BAT: Loan Item |
            ------------------
            """)

        item_id = user_input.read_integer('Enter id of item to loan: ')
        item = search.find_item_by_id(item_id, self._data_manager._catalogue_data)

        if item == None:
            print("!!! No such item. CANCELLING LOAN.")
        else:
            print(f"Found {item._type}: {item._name} ({item._year})")
            choice = user_input.read_bool("Is this the item (y/n)? ")
            if choice == 'y':
                print("Enter details of patron wanting to loan this item...")
                name = user_input.read_string("Patron's name: ")
                age = user_input.read_integer("Patron's age: ")

                patron = search.find_patron_by_name_and_age(name, age, self._data_manager._patron_data)

                if patron == None:
                    print("!!! NO SUCH PATRON. CANCELLING LOAN.")
                else:
                    length_of_loan = user_input.read_integer_range("How many days is the loan for (1 - 365)? ", 1, 365)
                    loan_success = logic.process_loan(patron, item, length_of_loan)

                    if loan_success:
                        print(f"Loan of {item._name} to {patron._name} successfully recorded")
                    else:
                        print(f"Sorry, {patron._name} is not able to borrow {item._name}")
            else:
                print("CANCELLING LOAN")

        return self._main_menu

    
    def _return_item(self):
        '''
        The return item menu screen of BAT. Follows the process:
        - ask the user for the name and age of the patron returning the item
        - print a list of loans that user currently has
        - ask for the item ID of the item being returned, and continue asking until
        a valid item ID is entered
        - process the return of the item

        If the process fails at any point (e.g., a patron with the given name and age
        can't be found in the patron database), return to the main menu screen.

        If the return is successfully processed, print a message then return to the
        main menu screen.
        '''
        print("""
            --------------------
            | BAT: Return Item |
            --------------------
            """)

        print("Enter details of patron wanting to return an item...")
        name = user_input.read_string("Patron's name: ")
        age = user_input.read_integer("Patron's age: ")

        patron = search.find_patron_by_name_and_age(name, age, self._data_manager._patron_data)

        if patron == None:
            print("!!! NO SUCH PATRON. CANCELLING RETURN.")
        else:
            print(f"{patron._name}'s active loans:")
            loaned_ids = []
            for l in patron._loans:
                print(l)
                loaned_ids.append(l._item._id)

            choice = user_input.read_integer("Enter the ID of the item to return: ")
            while choice not in loaned_ids:
                print(f"That is not an ID of an item currently loaned by {patron._name}")
                choice = user_input.read_integer("Enter the ID of the item to return: ")

            logic.process_return(patron, choice)
            print(f"Return of item from {patron._name} successfully recorded")

        return self._main_menu
    
    def _search_for_patron(self):
        '''
        The patron search menu screen of BAT. Allows users to enter a name or age (one 
        or the other, not both), and have the details of any patrons with that name or
        age printed out.
        '''
        print("""
            --------------------
            | BAT: Find Patron |
            --------------------

            1. Search by name
            2. Search by age
            3. Back
            """)

        choice = user_input.read_integer_range('Enter your choice: ', 1, 3)

        patrons_found = []

        match choice:
            case 1:
                name = user_input.read_string("Enter name: ")
                patrons_found = search.find_patron_by_name(name, self._data_manager._patron_data)
            case 2:
                age = user_input.read_integer("Enter age: ")
                patrons_found = search.find_patron_by_age(age, self._data_manager._patron_data)
            case 3:
                return self._main_menu
            case _:
                return self._search_for_patron

        if len(patrons_found) == 0:
            print("NO PATRONS FOUND MATCHING SEARCH DATA.")
        else:
            print("PATRON(S) FOUND: ")
            for p in patrons_found:
                print(p, end='\n')
        
        return self._search_for_patron
    
    def _register_patron(self):
        '''
        The register patron menu screen of BAT. Allows the user to create a new
        patron for the database. The user is asked for a name, and an age (from 0 to
        100 inclusive). The new patron will start with no outstanding fees, no loans,
        and no completed training.
        '''
        print("""
            ----------------------------
            | BAT: Register New Patron |
            ----------------------------
            """)

        patron_name = user_input.read_string("Patron name: ")
        patron_age = user_input.read_integer_range("Patron age: ", 0, 100)

        self._data_manager.register_patron(patron_name, patron_age)

        return self._main_menu
    
    def _access_makerspace(self):
        '''
        The makerspace validation menu screen of BAT. Allows the user to
        enter a patron's name and age, and prints a message to indicate
        whether that patron is allowed to use the makerspace. Returns
        to the main menu screen once the verification is complete.

        If a patron with the given name and age can not be found in the patron
        database, prints an error message and return to the main menu.
        '''
        print("""
            -----------------------------------
            | BAT: Validate Makerspace Access |
            -----------------------------------
            """)
        
        name = user_input.read_string("Enter name: ")
        age = user_input.read_integer("Enter age: ")

        patron = search.find_patron_by_name_and_age(name, age, self._data_manager._patron_data)

        if (patron == None):
            print("!!! NO SUCH PATRON")
        else:
            allowed = logic.can_use_makerspace(patron._age, patron._outstanding_fees, patron._makerspace_training)
            if allowed:
                print(f"{patron._name} is allowed to use the makerspace")
            else:
                print(f"{patron._name} is NOT allowed to use the makerspace")

        return self._main_menu

    def _quit(self):
        '''
        The quit menu screen of BAT. Saves the current state of patron and
        catalogue data, overriting any existing data files.
        '''
        print("Bye...")
        self._data_manager.save_patrons()
        self._data_manager.save_catalogue()

        return self._quit