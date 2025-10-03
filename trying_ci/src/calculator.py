class Calculator(object):
    def __init__(self):
        self._answer = 0
    
    def get_answer(self):
        return self._answer

    def reset(self):
        self._answer = 0
        return self

    def add(self, num):
        self._answer += num
        return self
    
    def subtract(self, num):
        self._answer -= num
        return self
    
    def multiply(self, num):
        self._answer *= num
    
    def power(self, num):
        self._answer ** num
        return self
    