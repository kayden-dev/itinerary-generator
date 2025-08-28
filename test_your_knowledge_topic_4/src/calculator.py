# Student name: Kayden Nguyen
# Student ID: 33878935

class Calculator(object):
    def __init__(self):
        self.answer = 0

    def get_answer(self):
        return self.answer
    
    def add(self,num):
        self.answer += num
        return self

    def subtract(self,num):
        self.answer -= num
        return self

    def multiply(self,num):
        self.answer *= num
        return self

    def power(self,num):
        self.answer **= num
        return self

    def reset(self):
        return