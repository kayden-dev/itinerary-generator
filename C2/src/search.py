'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

def find_patron_by_name(name, patron_data):
    '''
    Find all the patrons with the given name.
    Search is case insensitive.
        Args:
            name (string): the name to search for.
            patron_data: the patron data to search (from a DataManager).
        
        Returns:
            a list of patrons with the given name, or an empty list if
            none were found.
    '''
    found = []

    for patron in patron_data:
        if patron._name == name:
            found.append(patron)

    return found


def find_patron_by_age(age, patron_data):
    '''
    Find all the patrons with the given age.
        Args:
            age (int): the age to search for.
            patron_data: the patron data to search (from a DataManager).
        
        Returns:
            a list of patrons with the given age, or an empty list if
            none were found.
    '''
    found = []

    for patron in patron_data:
        if patron._age == age:
            found.append(patron)

    return found


def find_patron_by_name_and_age(name, age, patron_data):
    '''
    Find the patron with the given age. Assumes there are no two patrons
    with the same name and age combination.
        Args:
            name (string): the name to search for.
            age (int): the age to search for.
            patron_data: the patron data to search (from a DataManager).
        
        Returns:
            a patron with the given name and age, or None.
    '''
    # find the first patron in the database with the given name and age combo
    for patron in patron_data:
        if (patron._name.lower() == name.lower()) and (patron._age == age):
            return patron

    return None


def find_item_by_id(item_id, catalogue_data):
    '''
    Find the item with the given ID.
        Args:
            item_id (int): the item ID to search for.
            catalogue_data: the catalogue data to search (from a DataManager).

        Returns:
            the item with the given ID, or None.
    '''
    found = None

    for item in catalogue_data:
        if item._id == item_id:
            found = item

    return found