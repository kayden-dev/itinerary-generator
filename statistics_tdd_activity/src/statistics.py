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
  cur_min = data[0]
  for num in data:
    if num < cur_min: cur_min = num
  return cur_min

def maximum(data):
  cur_max = data[0]
  for num in data:
    if num > cur_max: cur_max = num
  return cur_max