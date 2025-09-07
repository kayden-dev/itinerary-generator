def sum(data):
    total = 0
    for val in data:
        total += val
    return total


def mean(data):
    total = sum(data)
    count = 0
    for i in data:
        count += 1
    return total / count


def minimum(data):
    min = data[0]
    for i in range(1, len(data)):
        if data[i] < min:
            min = data[i]
    return min


def maximum(data):
    max = data[0]
    for i in range(1, len(data)):
        if data[i] > max:
            max = data[i]
    return max