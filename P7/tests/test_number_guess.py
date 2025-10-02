import unittest
from unittest import mock
from src.number_guess import *

class TestNumberGuess(unittest.TestCase):

  @mock.patch('builtins.input')
  def test_get_guess_invalid(self,inp):
    inp.side_effect  = ['101','50']
    self.assertEqual(50, get_guess())

  @mock.patch('builtins.input')
  def test_get_guess_valid(self,inp):
    inp.return_value  = '50'
    self.assertEqual(50, get_guess())

  @mock.patch('random.randint')
  def test_select_answer(self,rand):
    rand.return_value = 5
    self.assertEqual(5,select_answer())

  def test_guess_correct(self):
    self.assertFalse(guess_correct(10,5))

  # play the game twice. the first time, exceed the guess count, while going to high and low, then second time get the answer, then end
  @mock.patch('builtins.input')
  @mock.patch('src.number_guess.select_answer')
  @mock.patch('src.number_guess.get_guess')
  def test_play_game(self,mock_get_guess, mock_select_answer,mock_inp):
    mock_select_answer.return_value = 50
    mock_get_guess.side_effect = [10,60,20,70,30,80,40,90,45,95,50]
    mock_inp.side_effect = ['y','n']
    self.assertEqual(None,play_game())