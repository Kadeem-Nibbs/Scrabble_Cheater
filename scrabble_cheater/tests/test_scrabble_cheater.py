import unittest
from pympler.asizeof import asizeof
from scrabble_cheater.scrabble_cheater import Board, WordFinder
from scrabble_cheater.scrabble_cheater import init_trie, init_dictionary
from scrabble_cheater.scrabble_cheater import trie, dictionary
import os.path


class BoardTest(unittest.TestCase):

    def test_board(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        self.assertEqual(board.occupied_squares, [])
        self.assertEqual(board.anchor_squares, [])

    def test_anchor_squares(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        correct_anchor_squares = {(7, 4), (6, 4), (6, 5), (6, 6), (6, 7),\
                                  (6, 8), (6, 9), (8, 4), (8, 5), (12, 7),\
                                  (8, 9), (8, 7), (9, 7), (10, 7), (11, 7)}
        self.assertEqual(set(board.anchor_squares), correct_anchor_squares)

    def test_square_has_no_vertical_neighbors(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        self.assertTrue(board.square_has_no_vertical_neighbors(7, 4))
        self.assertFalse(board.square_has_no_vertical_neighbors(7, 7))
        self.assertFalse(board.square_has_no_vertical_neighbors(9, 7))

    def test_get_adjacent_empty_squares(self):
        game_board = [['A' for row in range(15)] for column in range(15)]
        board = Board(game_board)
        self.assertEqual(board.get_adjacent_empty_squares(7, 7), [])

        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        self.assertEqual(set(board.get_adjacent_empty_squares(7, 7)), set([(6, 7)]))
        self.assertEqual(set(board.get_adjacent_empty_squares(7, 4)), set([(7, 3), (8, 4), (6, 4)]))
        self.assertEqual(set(board.get_adjacent_empty_squares(11, 7)), set([(11, 6), (11, 8), (12, 7)]))

    def test_cross_checks(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.compute_cross_checks()
        self.assertEqual(board.cross_checks, {})
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        self.assertEqual(board.cross_checks, {(6, 4): set(['A', 'E', 'O']),\
                         (6, 9): set(['A', 'B', 'D', 'F', 'H', 'M', 'O', 'N', 'P', 'R', 'W', 'Y']),\
                         (6, 7): set([]), (6, 8): set(['A', 'E']), (6, 6): set(['A', 'I', 'E', 'U']),\
                         (12, 7): set(['S']), (8, 9): set(['S', 'R', 'D', 'X', 'F', 'H', 'M', 'L', 'T', 'N']),\
                         (8, 8): set(['A', 'I', 'O']), (8, 6): set(['A', 'I', 'O']),\
                         (8, 5): set(['A', 'B', 'E', 'D', 'G', 'I', 'H', 'M', 'L', 'N', 'S', 'R', 'T', 'W', 'Y', 'X']),\
                         (6, 5): set(['A', 'B', 'D', 'F', 'H', 'K', 'M', 'L', 'N', 'P', 'T', 'Y', 'Z']),\
                         (8, 4): set(['E'])})

    def test_can_play_letter(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.compute_cross_checks()
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        self.assertTrue(board.can_play_letter(6, 9, 'A'))
        self.assertTrue(board.can_play_letter(12, 7, 'S'))
        self.assertFalse(board.can_play_letter(6, 7, 'X'))
        self.assertFalse(board.can_play_letter(6, 5, 'C'))

    def test_part_of_vertical_word(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        self.assertFalse(board.part_of_vertical_word(7, 3))
        self.assertTrue(board.part_of_vertical_word(11, 7))
        self.assertFalse(board.part_of_vertical_word(0, 0))


class WordFinderTest(unittest.TestCase):

    def test_init(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        rack = "DJIKS__"
        wf = WordFinder(board, rack)
        self.assertEqual(wf.board, board)
        self.assertEqual(wf.rack, rack)
        num_prefixes = sum([len(prefixes) for prefixes in wf.prefixes])
        self.assertGreater(num_prefixes, 6000)

    def test_find_legal_prefixes(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 4), 'across')
        rack = "NEUMANN"
        wf = WordFinder(board, rack)
        legal_prefixes_at_10_7 = set(['', 'A', 'E', 'M', 'N', 'AE', 'AM', 'AN',\
                                  'EM', 'EN', 'EU', 'ME', 'MU', 'NA', 'NE',\
                                  'UN', 'ANN', 'ENN', 'MAN', 'MEN', 'NAN',\
                                  'NEM', 'UNM', 'UNN', 'AMEN', 'ANEM', 'ENAM',\
                                  'MANN', 'NANN', 'UNAM', 'UNEM', 'UNANN'])
        calculated_legal_prefixes = {p["prefix"] for p in wf.find_legal_prefixes(board, 10, 7)}
        self.assertEqual(legal_prefixes_at_10_7, calculated_legal_prefixes)

    def test_prefix_can_fit(self):
        game_board = [[None for row in range(15)] for column in range(15)]
        board = Board(game_board)
        rack = "DJIKS__"
        wf = WordFinder(board, rack)
        board.place_word("TRIOL", (7, 7), 'down')
        board.place_word("RATTLE", (7, 5), 'down')
        node = trie["R"]["A"]
        prefix = "RA"
        prefix_info = {"node": node, "prefix": prefix}
        self.assertTrue(wf.prefix_can_fit(board, prefix_info, 7, 7))

if __name__ == "__main__":
    init_dictionary("ENABLE.txt")
    init_trie(dictionary)
    unittest.main()
