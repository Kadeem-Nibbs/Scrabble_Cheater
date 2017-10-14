import unittest
from scrabble_cheater import *

class TestScrabble(unittest.TestCase):

    def test_fit_word_on_empty_column(self):
        """
        Tests fit_word's performance on an empty column that will intersect
        with two words.
        """
        # log = logging.getLogger( "Test")
        global scrabble_board
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[5][1] = 'M'
        scrabble_board[5][3] = 'N'
        scrabble_board[7][1] = 'M'
        scrabble_board[7][3] = 'N'
        #import ipdb; ipdb.set_trace()
        location = fit_word("CATASTROPHE", "c2")['locations'][0]
        self.assertEqual(location['score'], 28)
        self.assertEqual(location['location'], ((4, 2), (14, 2)))
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]

    def test_fit_word_on_empty_row(self):
        """
        Tests fit_word's performance on an empty row that will intersect
        with two words.
        """
        global scrabble_board
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[5][1] = 'M'
        scrabble_board[5][3] = 'N'
        scrabble_board[7][1] = 'M'
        scrabble_board[7][3] = 'N'
        location = fit_word("CATASTROPHE", "c2")['locations'][0]
        self.assertEqual(location['score'], 28)
        self.assertEqual(location['location'], ((4, 2), (14, 2)))
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]

    def test_fit_word_on_occupied_column(self):
        """
        Tests fit_word's performance on a non-empty column that intersects
        with two words.
        """
        global scrabble_board
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[5][1] = 'M'
        scrabble_board[5][2] = 'A'
        scrabble_board[5][3] = 'N'
        scrabble_board[7][1] = 'M'
        scrabble_board[7][2] = 'A'
        scrabble_board[7][3] = 'N'
        location = fit_word("CATASTROPHE", "c2")['locations'][0]
        self.assertEqual(location['score'], 18)
        self.assertEqual(location['location'], ((4, 2), (14, 2)))
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[5][1] = 'M'
        scrabble_board[5][3] = 'N'
        scrabble_board[7][1] = 'M'
        scrabble_board[7][2] = 'A'
        scrabble_board[7][3] = 'N'
        location = fit_word("CATASTROPHE", "c2")['locations'][0]
        self.assertEqual(location['score'], 23)
        self.assertEqual(location['location'], ((4, 2), (14, 2)))
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]

    def test_fit_word_on_occupied_row(self):
        """
        Tests fit_word's performance on a non-empty row that intersects
        with two words.
        """
        global scrabble_board
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[1][5] = 'M'
        scrabble_board[2][5] = 'A'
        scrabble_board[3][5] = 'N'
        scrabble_board[1][7] = 'M'
        scrabble_board[2][7] = 'A'
        scrabble_board[3][7] = 'N'
        location = fit_word("CATASTROPHE", "r2")['locations'][0]
        self.assertEqual(location['score'], 18)
        self.assertEqual(location['location'], ((2, 4), (2, 14)))
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[1][5] = 'M'
        scrabble_board[3][5] = 'N'
        scrabble_board[1][7] = 'M'
        scrabble_board[2][7] = 'A'
        scrabble_board[3][7] = 'N'
        location = fit_word("CATASTROPHE", "r2")['locations'][0]
        self.assertEqual(location['score'], 23)
        self.assertEqual(location['location'], ((2, 4), (2, 14)))
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]

    def test_multiple_locations_in_column(self):
        """
        Tests fit_word's performance on a non-empty column where a word
        can be placed in multiple locations.
        """
        global scrabble_board
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[5][2] = 'A'
        location1, location2 = fit_word("CATASTROPHE", "c2")['locations']
        self.assertEqual(location1['score'], 18)
        self.assertEqual(location1['location'], ((4, 2), (14, 2)))
        self.assertEqual(location2['score'], 18)
        self.assertEqual(location2['location'], ((2, 2), (12, 2)))

    def test_multiple_locations_in_row(self):
        """
        Tests fit_word's performance on a non-empty row where a word
        can be placed in multiple locations.
        """
        global scrabble_board
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        scrabble_board[2][5] = 'A'
        location1, location2 = fit_word("CATASTROPHE", "r2")['locations']
        self.assertEqual(location1['score'], 18)
        self.assertEqual(location1['location'], ((2, 4), (2, 14)))
        self.assertEqual(location2['score'], 18)
        self.assertEqual(location2['location'], ((2, 2), (2, 12)))
