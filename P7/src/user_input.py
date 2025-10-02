def is_int(val):
    '''
    Helper function. Do not change.
    Returns True if val can be interpreted as an integer, otherwise returns false.
    '''
    try:
        int(val)
        return True
    except ValueError:
        return False


def is_float(val):
    '''
    Helper function. Do not change.
    Returns True if val can be interpreted as a float, otherwise returns false.
    '''
    try:
        float(val)
        return True
    except ValueError:
        return False


def read_string(prompt):
    '''
    Helper function. Do not change.
    Prints a prompt to the user and returns their input.
    '''
    return input(prompt)


def read_integer(prompt):
    line = read_string(prompt)
    while not is_int(line):
        print("Please enter a whole number.")
        line = read_string(prompt)
    num = int(line)
    return num


def read_float(prompt):
    line = read_string(prompt)
    while not is_float(line):
        print("Please enter a decimal number.")
        line = read_string(prompt)
    num = float(line)
    return num


def read_integer_range(prompt, min, max):
    num = read_integer(prompt)
    while (num < min) or (num > max):
        print(f"Please enter a value between {min} and {max}")
        num = read_integer(prompt)
    return num


def read_float_range(prompt, min, max):
    num = read_float(prompt)
    while (num < min) or (num > max):
        print(f"Please enter a value between {min} and {max}")
        num = read_float(prompt)
    return num