'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

from datetime import date, timedelta

from src.loan import Loan

def type_of_patron(age):
    '''
    Return a string describing the type of patron based on their age.
        Args:
            age (int): the age to describe.

        Returns:
            A string describing the age, according to the rules:
            - "ERROR" if the age is less than 0.
            - "Minor" if the age is 0 or more, and less than 18.
            - "Adult" if the age is 18 or more, and less than 90.
            - "Elderly" if the age is 90 or more.
    '''
    if age < 0:
        return "ERROR"
    elif age < 18:
        return "Minor"
    elif age < 90:
        return "Adult"
    else:
        return "Elderly"


def can_borrow(type_of_item, patron_age, length_of_loan, outstanding_fees, gardening_tool_training, carpentry_tool_training):
    '''
    Determine whether a loan can occur.
        Args:
            type_of_item (string): either "Book", "Gardening tool", or "Carpentry tool".
            patron_age (int): the age of the patron wanting to borrow the item, in years.
            length_of_loan (int): the number of days the patron wants to loan the item for.
            outstanding_fees (float): the fees the patron owes, before any discounts are considered.
            gardening_tool_training (bool): whether the patron has completed the gardening tool training or not.
            carpentry_tool_training (bool): whether the patron has completed the carpentry tool training or not.
        Returns:
            True if the patron is allowed to borrow the item, otherwise false. False if an invalid item type is provided.
    '''
    if type_of_item == "Book":
        return can_borrow_book(patron_age, length_of_loan, outstanding_fees)
    elif type_of_item == "Gardening tool":
        return can_borrow_gardening_tool(patron_age, length_of_loan, outstanding_fees, gardening_tool_training)
    elif type_of_item == "Carpentry tool":
        return can_borrow_carpentry_tool(patron_age, length_of_loan, outstanding_fees, carpentry_tool_training)

    return False


def can_borrow_book(patron_age, length_of_loan, outstanding_fees):
    '''
    Determine whether a book loan can occur.
        Args:
            patron_age (int): the age of the patron wanting to borrow the item, in years.
            length_of_loan (int): the number of days the patron wants to loan the item for.
            outstanding_fees (float): the fees the patron owes, before any discounts are considered.
        Returns:
            True if the patron is allowed to borrow the book, otherwise false.
            A patron is allowed to borrow a book for up to 8 weeks if they have no fees owed (i.e., fees
            to pay after discounts are considered). If the patron has fees owed they are not allowed
            to borrow a book.
    '''
    if length_of_loan >= 56:
        return False
    
    discount = calculate_discount(patron_age)
    fees_owed = outstanding_fees - (outstanding_fees * (discount / 100))

    if fees_owed > 0:
        return False
    
    return True


def can_borrow_gardening_tool(patron_age, length_of_loan, outstanding_fees, gardening_tool_training):
    '''
    Determine whether a gardening tool loan can occur.
        Args:
            patron_age (int): the age of the patron wanting to borrow the item, in years.
            length_of_loan (int): the number of days the patron wants to loan the item for.
            outstanding_fees (float): the fees the patron owes, before any discounts are considered.
            gardening_tool_training (bool): whether the patron has completed the gardening tool training or not.
        Returns:
            True if the patron is allowed to borrow the gardening tool, otherwise false.
            A patron is allowed to borrow a gardening tool for up to 4 weeks.
            They are not allowed to borrow a gardening tool if they have not completed the gardening tool
            training or if they have fees owed (i.e., fees to pay after discounts are considered).
    '''
    discount = calculate_discount(patron_age)
    fees_owed = outstanding_fees - (outstanding_fees * (discount / 100))
    if fees_owed > 0:
        return False

    if length_of_loan > 28:
        return False
    
    return gardening_tool_training


def can_borrow_carpentry_tool(patron_age, length_of_loan, outstanding_fees, carpentry_tool_training):
    '''
    Determine whether a carpentry tool loan can occur.
        Args:
            patron_age (int): the age of the patron wanting to borrow the item, in years.
            length_of_loan (int): the number of days the patron wants to loan the item for.
            outstanding_fees (float): the fees the patron owes, before any discounts are considered.
            carpentry_tool_training (bool): whether the patron has completed the carpentry tool training or not.
        Returns:
            True if the patron is allowed to borrow the carpentry tool, otherwise false.
            A patron is allowed to borrow a carpentry tool for up to 2 weeks.
            They are not allowed to borrow a carpentry tool if they have not completed the carpentry tool
            training, if they have fees owed (i.e., fees to pay after discounts are considered), or if
            they are not classified as an adult.
    '''
    discount = calculate_discount(patron_age)
    fees_owed = outstanding_fees - (outstanding_fees * (discount / 100))

    if (fees_owed > 0) or (patron_age <= 18) or (patron_age >= 90):
        return False

    if length_of_loan > 14:
        return False
    
    return carpentry_tool_training


def can_use_makerspace(patron_age, outstanding_fees, makerspace_training):
    '''
    Determine whether a patron can use the makerspace.
        Args:
            patron_age (int): the age of the patron wanting to use the makerspace.
            outstanding_fees (float): the fees the patron owes, before any discounts are considered.
            makerspace_training (bool): whether the patron has completed the makerspace training or not.
        Returns:
            True if the patron is allowed to use the makerspace, otherwise false.
            A patron is allowed to use the makerspace if they have completed the training, have no
            fees owed (i.e., fees to pay after discounts are considered), and are classified as
            an adult.
    '''
    result = makerspace_training

    patron_type = type_of_patron(patron_age)
    fees_owed = outstanding_fees

    if (patron_type == "ERROR"):
        result = False
    elif (patron_type == "Elderly") or (patron_type == "Minor"):
        result = False
    else:
        discount = calculate_discount(patron_age)
        fees_owed -= outstanding_fees * (discount / 100)

    if (result == True) and (fees_owed > 0):
        result = False

    return result


def calculate_discount(age):
    '''
    Calculate the discount a patron is entitled to based on their age.
        Args:
            age (int): a patron's age in years.
        Returns:
            The discount the patron is entitled to, as a whole number percentage, or "ERROR"
            if an invalid (i.e., negative) age is entered.
            - Patrons under 50 receive no discount.
            - Patrons aged 50 and over, but under 65 receive a 10% discount.
            - Patrons aged 65 and over, but under 90 receive a 15% discount.
            - Patrons aged 90 and over receive a 100% discount.
    '''
    if age < 0:
        return "ERROR"
    elif age < 50:
        return 0
    elif (age >= 50) and (age < 65):
        return 10
    elif (age >= 65) and (age < 90):
        return 15
    elif age >= 90:
        return 100


def process_return(patron, item_id):
    '''
    Process the return of an item.
    Removes the loan from the patron, and adjusts the "on loan" count for the item.
        Args:
            patron (Patron): the patron returning the item. It is assumed
                this is the patron who loaned the item.
            item_id (int): the ID of the item being returned.
    '''
    to_return = patron.find_loan(item_id)
    to_return._item._on_loan - 1
    patron._loans.remove(to_return)


def process_loan(patron, item, length_of_loan):
    '''
    Process the loan of an item.
    Checks that the item can be borrowed, and if so, creates a loan with an appropriate due date,
    assigns the loan to the patron, and adjusts the "on loan" count for the item.
        Args:
            patron (Patron): the patron returning the item. It is assumed
                this the patron does not already have an active loan for the item.
            item (BorrowableItem): the item the patron wants to loan.
            length_of_loan (int): the number of days the patron wants to borrow the item for.
        Returns:
            True if the loan was successful, or false if it could not be completed.
    '''
    due_date = date.today() + timedelta(days=length_of_loan)
    
    if can_borrow(item._type, patron._age, length_of_loan, patron._outstanding_fees, patron._gardening_tool_training, patron._carpentry_tool_training):
        new_loan = Loan(item, due_date)
        patron._loans.append(new_loan)
        item._on_loan += 1
        return True
    else:
        return False