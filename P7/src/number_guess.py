import random

def get_guess():
    print('Enter a number between 0 and 100: ', end='')
    guess = int(input())

    if (guess < 0) or (guess > 100):
        print('Enter a number between 0 and 100: ', end='')
        guess = int(input())
    
    return guess

def guess_too_high(guess, answer):
    if guess > answer:
        return True
    else:
        return False

def guess_too_low(guess, answer):
    if guess < answer:
        return True
    else:
        return False

def guess_correct(guess, answer):
    if guess == answer:
        return True
    else:
        return False

def select_answer():
    return random.randint(0, 100)

def play_game():
    playing = True

    while playing:
        print('Let''s play!')
        guess_count = 0
        answer = select_answer()

        while guess_count < 10:
            guess_count += 1
            print(f'Guess number {guess_count}')
            guess = get_guess()

            if guess_too_high(guess, answer):
                print('Too high')
            elif guess_too_low(guess, answer):
                print('Too low')
            elif guess_correct(guess, answer):
                print('You got it!')
                break

        if guess_count == 10:
            print('Too many guesses! Sorry.')

        print('Play again? Enter ''y'' for yes, or anything else for no: ', end='')
        choice = input()
        if choice != 'y':
            playing = False

if __name__ == '__main__':
    play_game()