# Student name: Kayden Nguyen
# Student ID: 33878935

def calculate_discount(cart_value, seniors, purchase_count):
    discount = 0
    loyal_customer = False
    
    if purchase_count > 10:
        loyal_customer = True
    
    if cart_value >= 250:
        if seniors:
            discount = 15
        else:
            discount = 10
    elif cart_value >= 100:
        if seniors:
            discount = 10
        else:
            discount = 5
            
    if loyal_customer:
        discount += 5
    
    return discount