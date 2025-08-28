def sum(data):
  total = 0 
  for num in data:
    total += num
  return total

def mean(data):
  total = 0
  count = 0
  for num in data:
    total += num
    count += 1
  return total/count

def minimum(data):
  return