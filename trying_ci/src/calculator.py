class Calculator(object):
    """Class for performing calculator operations"""

    def __init__(self):
        """Constructor method for calculator"""
        self._answer = 0

    def get_answer(self):
        """Returns the current answer of the calculator"""
        return self._answer

    def reset(self):
        """Resets the current answer of the calculator"""
        self._answer = 0
        return self

    def add(self, num):
        """Adds a number to the calculator"""
        self._answer += num
        return self

    def subtract(self, num):
        """Substracts a number from the calculator"""
        self._answer -= num
        return self

    def multiply(self, num):
        """Multiplies a number to the calculator"""
        self._answer *= num

    def power(self, num):
        """Raises the calculator to a power"""
        self._answer ** num
        return self