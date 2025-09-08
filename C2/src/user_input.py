'''
Author: Charlotte Pierce

Assignment code for FIT2107 Software Quality and Testing.
Not to be shared or distributed without permission.
'''

def is_int(val):
    '''
    Verify if a value is a valid integer.
        Args:
            val: the value to check.
        
        Returns:
            true if the value is a valid integer, otherwise false.
    '''
    try:
        int(val)
        return True
    except ValueError:
        return False


def is_float(val):
    '''
    Verify if a value is a valid float.
        Args:
            val: the value to check.
        
        Returns:
            true if the value is a valid float, otherwise false.
    '''
    try:
        float(val)
        return True
    except ValueError:
        return False


def read_string(prompt):
    '''
    Read a string value from the user.
        Args:
            prompt (string): a message to print to the user.

        Return:
            the value the user entered.
    '''
    return input(prompt)


def read_integer(prompt):
    '''
    Read an integer value from the user. Continue prompting the
    user until they enter a valid integer value.
        Args:
            prompt (string): a message to print to the user.

        Return:
            the integer value the user entered.
    '''
    line = read_string(prompt)
    while not is_int(line):
        print("Please enter a whole number.")
        line = read_string(prompt)
    num = int(line)
    return num


def read_float(prompt):
    '''
    Read a float value from the user. Continue prompting the
    user until they enter a valid float value.
        Args:
            prompt (string): a message to print to the user.

        Return:
            the float value the user entered.
    '''
    line = read_string(prompt)
    while not is_float(line):
        print("Please enter a decimal number.")
        line = read_string(prompt)
    num = float(line)
    return num


def read_integer_range(prompt, min, max):
    '''
    Read an integer value from the user. Continue prompting the
    user until they enter a valid integer value and it is within
    the specified range.
        Args:
            prompt (string): a message to print to the user.
            min (int): the lowest acceptable value.
            max (int): the highest acceptable value.

        Return:
            the integer value the user entered.
    '''
    num = read_integer(prompt)
    while (num < min) or (num > max):
        print(f"Please enter a value between {min} and {max}")
        num = read_integer(prompt)
    return num


def read_float_range(prompt, min, max):
    '''
    Read a float value from the user. Continue prompting the
    user until they enter a valid float value and it is within
    the specified range.
        Args:
            prompt (string): a message to print to the user.
            min (int): the lowest acceptable value.
            max (int): the highest acceptable value.

        Return:
            the float value the user entered.
    '''
    num = read_float(prompt)
    while (num < min) or (num > max):
        print(f"Please enter a value between {min} and {max}")
        num = read_float(prompt)
    return num


def read_bool(prompt):
    '''
    Read a boolean value from the user. Continue prompting the
    user until they enter a valid boolean value of 'y', 'Y', 'n',
    or 'N'.
        Args:
            prompt (string): a message to print to the user.

        Return:
            'y' if the user entered 'Y' or 'y', and 'n' if the
            user entered 'N' or 'n'.
    '''
    line = read_string(prompt).lower()
    while (line != 'y') and (line != 'n'):
        print("Please enter 'y' or 'n'")
        line = read_string(prompt).lower()
    return line