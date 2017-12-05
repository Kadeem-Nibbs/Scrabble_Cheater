import Tkinter as tk
import pickle
from scrabble_constants import WWF_LET_VALUES, WWF_BONUS_TILES, BONUS_TILE_COLORS
from collections import Counter
from profilehooks import profile
from pprint import PrettyPrinter
from pympler.asizeof import asizeof
from copy import deepcopy
pp = PrettyPrinter()

BOARD_SIZE = 15
MAX_RACK_LENGTH = 7
FULL_RACK_BONUS = 35
BLANK_TILE = "_"
ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
TERMINAL = '$' # denotes the end of a word in trie
WORD_FILE = "ENABLE.txt" # Enhanced North American Benchmark Lexicon with
                         # with a few hundred additions of more modern words
                         # and about 100 deletions of offensive words made by
                         # Zynga
GUI_DIMENSIONS = '600x600'
EMPTY_BOARD = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
score_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
dictionary = {} # for checking if a word is in dictionary
trie = {} # for seeing what words can be made on the board with rack

class Display(object):

    def __init__(self, board, word_finder):
        self.GUI = tk.Tk()
        self.initialize_GUI()
        self.input_board = [[None for row in range(BOARD_SIZE)] for column in range(BOARD_SIZE)]
        self.board = board
        self.word_finder = word_finder

    def initialize_GUI(self):
        """
        Initialize displayed board to showed letters from board variable.  Set
        the colors of each square according to the bonus it contains.

        """
        self.board_entry = tk.Frame(self.GUI)
        self.board_entry.grid(row=1, column=1)
        self.GUI.geometry(GUI_DIMENSIONS)

        for r in range(BOARD_SIZE):
            for c in range(BOARD_SIZE):
                square = (r, c)
                bonus = WWF_BONUS_TILES.get(square)
                color = BONUS_TILE_COLORS[bonus]
                content = tk.StringVar()
                if board[r][c]:
                    letter = board[r][c]
                    content.set(letter)
                e = tk.Entry(self.board_entry, width=4, bg=color, textvariable=content)
                e.grid(row=r, column=c)

        btn = tk.Button(self.GUI, text="Analyze", command=lambda: self.update_board_display_words())
        tk.Label(self.GUI, text="Enter rack of letters: ").grid(row=r+2, column=1, sticky='W')
        self.rack_entry = tk.Entry(self.GUI)
        self.rack_entry.grid(row=r+2, column=1, sticky='E')

        btn.grid(row=r+3)

    def update_board_display_words(self):
        """
        Sets board and rack using values from the respective entry slots.  Uses
        these to find and display the highest scoring words that can be played.
        Resets the board to the empty state after every run.

        Parameters:
        -----------
        rack_entry: tk.Entry
            The tk widget where the rack letters are entered.

        """
        for child in self.board_entry.children.values():
            r = int(child.grid_info()['row'])
            c = int(child.grid_info()['column'])
            val = child.get() # retrieve value from input cell
            if len(val) in (1, 2):
                letter = val.upper()
                self.input_board[r][c] = letter

        self.board.read_board(self.input_board)
        rack = self.rack_entry.get().upper()
        self.word_finder.load_rack(rack)
        self.word_finder.update_board(self.board)
        best_plays = self.word_finder.find_highest_scoring_words()
        print "Number of legal moves:", len(best_plays)
        for play in best_plays[:50]:
            print play
        print
        self.input_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]

    def run(self):
        """
        Wait for input board states and racks from the user.  Respond to
        pressed Analyze button with top 50 highest scoring words that can be
        played in the scenario.

        """
        self.initialize_GUI()
        self.GUI.mainloop()

    def print_board(self, board):
        for index, row in enumerate(board):
            print index, row
        print

class Board(object):

    def __init__(self, board):
        """
        Initializes the game board, including the letter and value of each tile.

        Parameters:
        -----------
        board: 2-d list
            Representation of game board.  Squares holding letters played with
            blank tiles hold the value "[letter]*" to denote that they should
            have no value.

        """
        self.input_board = board
        self.read_board(self.input_board)
        self.find_anchor_squares()
        self.compute_cross_checks()

    def read_board(self, board):
        self.board = [[None for row in range(BOARD_SIZE)] for column in range(BOARD_SIZE)]
        self.score_board = [[None for row in range(BOARD_SIZE)] for column in range(BOARD_SIZE)]
        self.occupied_squares = []

        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                letter = board[i][j]
                if letter:
                    self.occupied_squares.append((i, j))
                    if len(letter) == 1:
                        self.board[i][j] = letter
                        self.score_board[i][j] = WWF_LET_VALUES[letter]
                    elif len(letter) == 2:
                        self.board[i][j] = letter[0]
                        self.score_board[i][j] = 0
        self.input_board = deepcopy(board)
        self.find_anchor_squares()
        self.compute_cross_checks()

    def find_anchor_squares(self):
        """
        Returns a list of all of the anchor squares on the board.

        """
        self.anchor_squares = []
        for square in self.occupied_squares:
            adjacent_anchor_squares = self.find_anchor_squares_near(*square)
            self.anchor_squares.extend(adjacent_anchor_squares)
        # prune redundant squares
        self.anchor_squares = set(self.anchor_squares)
        for square in self.occupied_squares:
            row, column = square
            if square in self.anchor_squares and (row, column-1) in self.anchor_squares:
                self.anchor_squares.discard((row, column-1))
        self.anchor_squares = list(self.anchor_squares)

    def find_anchor_squares_near(self, row, column):
        """
        Anchor squares are the squares by which new words may be connected to
        existing words on the board.  I defined the set of anchor squares to be
        squares that are either hold a letter, or that are empty and one row above
        or below an occupied square.  In either case, the square must not be
        directly preceded in its row by an occupied square.

        This function returns a list of all occupied squares one index or less away
        from board[row][column].

        """
        anchor_squares = []
        if not on_board(row, column):
            return []
        if not on_board(row, column-1):
            anchor_squares.append((row, column))
        else:
            if not self.board[row][column-1]:
                anchor_squares.append((row, column))
        other_candidate_squares = [(row-1, column), (row+1, column)]
        for square in other_candidate_squares:
            if self.empty_and_not_preceded_by_letter(*square):
                anchor_squares.append(square)
        return anchor_squares

    def empty_and_not_preceded_by_letter(self, row, column):
        """
        Returns True if board[row][column] contains None (a letter has not been
        played there) and is not preceded by a square, board[row][column-1], which
        holds a letter.  Returns False otherwise.

        """
        if not on_board(row, column):
            return False
        if self.board[row][column]:
            return False
        if not on_board(row, column-1):
            return True
        if not self.board[row][column-1]:
            return True
        else:
            return False

    def get_anchor_squares(self):
        """
        Returns a list of all of the anchor squares on the board.

        """
        self.anchor_squares = []
        for square in occupied_squares:
            adjacent_anchor_squares = find_anchor_squares_near(*square)
            self.anchor_squares.extend(adjacent_anchor_squares)

    def place_word(self, word, start_square, direction=None):
        """Place word on board starting on start and going in direction."""
        row, column = start_square
        if direction == 'horizontal':
            if column + len(word) - 1 >= BOARD_SIZE: # word can't fit on board
                print "word", start_square, len(word)
                print "Word can't fit"
                return
            for c in word:
                if not self.board[row][column]:
                    self.board[row][column] = c
                    self.input_board[row][column] = c
                    self.occupied_squares.append((row, column))
                    self.score_board[row][column] = WWF_LET_VALUES[c]
                    column += 1
                    continue
                if self.board[row][column] != c:
                    print "Word can't fit"
                    return
                else:
                    column += 1

        elif direction == 'vertical':
            if row + len(word) - 1 >= BOARD_SIZE: # word can't fit on board
                print word, start_square, len(word)
                print "Word can't fit, too long"
                return
            for c in word:
                if not self.board[row][column]:
                    self.board[row][column] = c
                    self.input_board[row][column] = c
                    self.occupied_squares.append((row, column))
                    self.score_board[row][column] = WWF_LET_VALUES[c]
                    row += 1
                    continue
                if self.board[row][column] != c:
                    print word, self.board[row][column], c, (row, column)
                    print "Word can't fit, mismatched letter"
                    return
                else:
                    row += 1
        self.find_anchor_squares()
        self.compute_cross_checks()

    def square_has_no_vertical_neighbors(self, x, y):
        """
        Returns True if neither board[x-1][y] nor board[x+1][y] holds a letter.
        Returns False otherwise.

        """
        if not on_board(x-1, y):
            if not self.board[x+1][y]:
                return True
        elif not on_board(x+1, y):
            if not self.board[x-1][y]:
                return True
        else:
            if not (self.board[x+1][y] or self.board[x-1][y]):
                return True

    def get_adjacent_empty_squares(self, row, column):
        """Returns all empty squares adjacent to board[row][column] in a list."""
        adjacent_squares = []
        for r, c in ((row+1, column), (row-1, column), \
                            (row, column+1), (row, column-1)):
            if on_board(r, c) and not self.board[r][c]:
                adjacent_squares.append((r, c))
        return adjacent_squares

    def part_of_vertical_word(self, row, column):
        """
        Returns True if either of board[x-1][y] and board[x+1][y] holds a letter.
        Returns False otherwise.

        """
        if on_board(row+1, column) and self.board[row+1][column]:
            return True
        elif on_board(row-1, column) and self.board[row-1][column]:
            return True
        else:
            return False

    def transposed_input_board(self):
        return zip(*self.input_board)

    def compute_cross_checks(self):
        """
        Computes all of the letters that can be played on each square on the board
        without creating an illegal vertical word, places them in the global
        "cross_checks" dictionary.  If a square isn't in the dictionary, then any
        letter can be played at that square.

        """
        self.cross_checks = {}
        cross_check_squares = []
        for square in self.occupied_squares:
            cross_check_squares.extend(self.get_adjacent_empty_squares(*square))
        cross_check_squares = list(set(cross_check_squares))
        for square in cross_check_squares:
            row, column = square
            upper_part = lower_part = ""
            upper_r = row - 1
            lower_r = row + 1
            while on_board(upper_r, column) and self.board[upper_r][column]:
                upper_part = self.board[upper_r][column] + upper_part
                upper_r -= 1
            while on_board(lower_r, column) and self.board[lower_r][column]:
                lower_part = lower_part + self.board[lower_r][column]
                lower_r += 1
            if not (lower_part or upper_part):
                continue
            check_string = upper_part + "%s" + lower_part
            self.cross_checks[square] = set()
            for c in ALPHABET:
                possible_word = check_string % c
                if word_in_dict(possible_word):
                    self.cross_checks[square] |= set(c)

    def can_play_letter(self, x, y, letter):
        """
        Returns True if the letter can be played on square without creating an
        illegal crossing word, returns False otherwise.

        Parameters:
        -----------
        board: 2-d list, the game board
        x, y: ints, indices of empty square on board
        letter: string of length 1
            Letter to attempt to place

        """
        if not (x, y) in self.cross_checks:
            return True
        possible_letters = self.cross_checks.get((x, y))
        return letter in possible_letters


class WordFinder(object):

    def __init__(self, board, rack=None):
        """
        Initialize a WordFinder object given a board object and a string
        representing the letters in the tile rack.  Retrieve the game board
        (just the 2-d list) from the board object to avoid having to reference
        it through the board object repeatedly.  Find all of the prefixes (any
        beginning to a word) that can be constructed using the rack, store in
        an instance variable.

        """
        self.board = board
        self.board_t = Board(self.board.transposed_input_board())
        if rack:
            self.rack = rack
        else:
            self.rack = ""
        self.prefixes = [[] for x in range(MAX_RACK_LENGTH+1)]
        self.get_all_prefixes()

    def load_rack(self, rack):
        self.rack = rack
        self.get_all_prefixes()

    def update_board(self, board):
        self.board = board
        self.board_t = Board(self.board.transposed_input_board())

    def get_all_prefixes(self):
        """
        Resets self.prefixes to empty nested lists.  Find and store all
        prefixes that can be made using the letters in the rack, separate by
        length.

        """
        self.prefixes = [[] for x in range(MAX_RACK_LENGTH+1)]
        rack = make_counter(self.rack)
        self.get_all_prefixes_rec(trie, rack, "", ())

    def get_all_prefixes_rec(self, node, remaining_tiles, pref, tiles_played):
        """
        A prefix in this application is a valid beginning to a word that can be
        played in the squares to the left of an anchor square.
        populates the prefixes, instance variable with dictionaries containing
        information on the prefixes that can be made with the letters in the
        rack.  Each dictionary has the key-value pairs: "prefix", the string
        form of the prefix; "node", the node on the global trie corresponding
        to the prefix; "remaining_tiles", a dictionary containing counts of
        the letters remaining in the rack; "tiles_played", a tuple containing
        the tiles to put on the board, in order, to construct the prefix.

        Parameters:
        -----------
        node: dictionary
            Each key is a letter l that can be played to continue a prefix, the
            corresponding value of each is a dictionary containing letters that can
            be played after l to continue the prefix further.
        remaining_tiles: dictionary used as makeshift counter for letters remaining in rack
        pref: string
            The letters in the prefix already, in order played.
        tiles_played: list of strings
            The tiles put down to construct the prefix, in order played.

        """
        prefix_length = len(pref)
        prefix_info = {"prefix": pref,
                       "node": node,
                       "remaining_tiles": remaining_tiles,
                       "tiles_played": tiles_played,}
        self.prefixes[prefix_length].append(prefix_info)
        if not remaining_tiles:
            return
        for l in node.keys():
            if l == TERMINAL: # We can't always use complete words as prefixes, if
                              # the corresponding anchor square is empty,they may
                              # not touch a letter already on the board.
                continue
            if l in remaining_tiles:
                next_node = node[l]
                new_remaining_tiles = decrement_counter(remaining_tiles, l)
                self.get_all_prefixes_rec(next_node, new_remaining_tiles, pref+l, tiles_played+tuple(l))
            if BLANK_TILE in remaining_tiles:
                next_node = node[l]
                new_remaining_tiles = decrement_counter(remaining_tiles, BLANK_TILE)
                self.get_all_prefixes_rec(next_node, new_remaining_tiles, pref+l, tiles_played+tuple(BLANK_TILE))
        return

    def find_legal_prefixes(self, board, row, column):
        """
        Parameters:
        -----------
        row, column: integer indices of 2d list
        rack: string, the letters in the rack

        Returns:
        --------
        prefixes: list of dictionaries, beginnings to all words that can be played
                  through board[row][column]
            Each dictionary has the key-value pairs: "prefix", the string
            form of the prefix; "node", the node on the global trie corresponding
            to the prefix; "remaining_tiles", a dictionary containing counts of
            the letters remaining in the rack; "tiles_played", a tuple containing
            the tiles to put on the board, in order, to construct the prefix.

        """
        rack_length = len(self.rack)
        free_spaces_to_left = 0
        r, c = row, column
        while on_board(r, c): # count empty squares to the left of board[row][column]
                              # to determine how long prefixes can be
            if not on_board(r, c-1):
                break
            if not board.board[r][c-1]:
                c -= 1
                free_spaces_to_left += 1
            else: # found a letter on the board, go back one space
                free_spaces_to_left -= 1
                break
        free_spaces_to_left = min(free_spaces_to_left, rack_length)
        prefixes = []
        for num_letters in range(free_spaces_to_left + 1):
            valid_prefixes = [p for p in self.prefixes[num_letters] \
                              if self.prefix_can_fit(board, p, row, column)]
            prefixes.extend(valid_prefixes)
        return prefixes

    def prefix_can_fit(self, board, prefix_info, row, column):
        """
        Returns True if the letters in the proposed prefix, played horizontally
        with the last letter at board[row][column-1] would not form illegal
        vertical words with letters already on the board. Returns False otherwise.

        Parameters:
        -----------
        board: 2d list, the game board
        prefix: string
            The beginnings of a word that may be playable on the board.
        row, column: integer indices of board

        """
        if self.board.board[row][column]: # ensure prefix fits letter at board position
            letter = self.board.board[row][column]
            legal_next_letters = prefix_info["node"].keys()
            if letter not in legal_next_letters:
                return False
        prefix = prefix_info["prefix"]
        size = len(prefix)
        for i in range(size):
            if not self.board.can_play_letter(row, column-(size-i), prefix[i]):
                return False
        return True

    def score_word(self, board, tiles_played, location):
        """
        Returns the score from playing the tiles in tiles_played between
        start_square and end_square (inclusive).

        Parameters:
        -----------
        board: 2-d list, the game board
        tiles_played: list of single-character strings
            The tiles to play on the board, in order.
        start_square, end_square: 2-tuples of ints
            The locations on the board of the first and last letter, respectively,
            of the word being formed.

        """
        score = 0
        multiplier = 1
        tiles_played_index = 0
        crossing_word_scores = []
        start_square, end_square = location
        for row, column in get_squares_in_range(start_square, end_square):
            letter = board.board[row][column]
            if letter:
                score += WWF_LET_VALUES[letter]
                continue
            letter = tiles_played[tiles_played_index]
            tiles_played_index += 1
            bonus = find_bonus((row, column))
            board_position = {"board": board.board,
                              "score_board": board.score_board,
                              "position": (row, column),
                              "bonus": bonus,
                              "letter": letter,}
            if bonus:
                if board.part_of_vertical_word(row, column):
                    cw_score = self.crossing_word_score(board_position)
                    crossing_word_scores.append(cw_score)
                if bonus[1] == 'L':
                    score += WWF_LET_VALUES[letter] * int(bonus[0])
                elif bonus[1] == 'W':
                    score += WWF_LET_VALUES[letter]
                    multiplier *= int(bonus[0])
            else:
                score += WWF_LET_VALUES[letter]
                if board.part_of_vertical_word(row, column):
                    cw_score = self.crossing_word_score(board_position)
                    crossing_word_scores.append(cw_score)
        score *= multiplier
        score += sum(crossing_word_scores)
        if len(tiles_played) == 7:
            score += FULL_RACK_BONUS
        return score

    @staticmethod
    def crossing_word_score(board_position):
        """
        Calculates the score of the vertical word that intersects with
        board[row][column].

        Parameters:
        -----------
        board: 2-d list, the game board
        row, column: ints, indices on game board
        letter: single-character string
            Letter of the vertical word that intersects with the across word we
            found
        score_board: 2-d list, the value of the tile at each index of board
        bonus: string or None
            The bonus attached to board[row][column], one of: "2W", "2L", "3W",
            "3L".

        Returns:
        --------
        score: int
            The extra points gained from the crossing word.

        """
        board = board_position["board"]
        score_board = board_position["score_board"]
        row, column = board_position["position"]
        bonus = board_position["bonus"]
        letter = board_position["letter"]
        if bonus:
            if bonus[1] == 'L':
                score = (int(bonus[0]) * WWF_LET_VALUES[letter])
                multiplier = 1
            elif bonus[1] == 'W':
                score = WWF_LET_VALUES[letter]
                multiplier = int(bonus[0])
        else:
            score = WWF_LET_VALUES[letter]
            multiplier = 1
        top_row = row - 1
        bottom_row = row + 1
        while on_board(top_row, column) and board[top_row][column]:
            score += score_board[top_row][column]
            top_row -= 1

        while on_board(bottom_row, column) and board[bottom_row][column]:
            score += score_board[bottom_row][column]
            bottom_row += 1
        score *= multiplier
        return score

    def build_words_around_tile(self, node, board_position, rack_state):
        """
        Finds words that can be continued from the input node in the trie using the
        letter at board[row][column].

        Parameters:
        -----------
        board: 2-d list, the game board
        node: dictionary
            Represents current node in the trie
        row, column: ints, indices of board
        rack: dictionary
            The letters in the rack and the counts of each
        start_square: 2-tuple of ints
            The anchor square by which the created words are attached to
            the board
        tiles_played: list of single character strings
            The tiles played from the rack to reach the current node in the trie

        Returns:
        --------
        List of tuples describing words that can be played using letter at
        board[row][column], each tuple has the form
        (word, (start_square, end_square), tiles_played, score)

        """
        words = []
        row, column = board_position['position']
        board = board_position["board"]
        next_board_position = {'board': board,
                               'position': (row, column+1),
                               'anchor_square': board_position['anchor_square'],}
        letter = board.board[row][column]
        if letter in node.keys():
            next_node = node[letter]
            words.extend(self.build_words(next_node, next_board_position, rack_state))
        return words

    def build_words_through_empty_square(self, node, board_position, rack_state):
        """
        Finds words that can be continued from the input node in the trie by
        playing a letter from the rack at board[row][column].

        Parameters:
        -----------
        board: 2-d list, the game board
        node: dictionary
            Represents current node in the trie
        row, column: ints, indices of board
        rack: dictionary
            The letters in the rack and the counts of each
        start_square: 2-tuple of ints
            The anchor square by which the created words are attached to
            the board
        tiles_played: list of single character strings
            The tiles played from the rack to reach the current node in the trie

        Returns:
        --------
        List of tuples describing words that can be formed by playing aletter at
        board[row][column], each tuple has the form
        (word, (start_square, end_square), tiles_played, score)

        """
        words = []
        row, column = board_position['position']
        tiles_played = rack_state['tiles_played']
        remaining_tiles = rack_state['remaining_tiles']
        board = board_position['board']
        anchor_square = board_position['anchor_square']
        next_board_position = {'board': board,
                               'position': (row, column+1),
                               'anchor_square': anchor_square,}
        for letter in node.keys():
            if letter == TERMINAL:
                if tiles_played and (row, column) != anchor_square:
                    word = node[TERMINAL]
                    start, end = (row, column-len(word)), (row, column-1)
                    score = self.score_word(board, tiles_played, (start, end))
                    words.append((word, (start, end), tiles_played, score))
                continue
            if not self.board.can_play_letter(row, column, letter):
                continue
            if letter in remaining_tiles:
                next_node = node[letter]
                new_rack_state = {'remaining_tiles': decrement_counter(remaining_tiles, letter),
                                  'tiles_played': tiles_played+tuple(letter),}
                words.extend(self.build_words(next_node, next_board_position, new_rack_state))
            if BLANK_TILE in remaining_tiles:
                next_node = node[letter]
                new_rack_state = {'remaining_tiles': decrement_counter(remaining_tiles, BLANK_TILE),
                                  'tiles_played': tiles_played+tuple(BLANK_TILE),}
                words.extend(self.build_words(next_node, next_board_position, new_rack_state))
        return words

    def finish_word_on_board_edge(self, node, board_position, rack_state):
        """
        Finds words that can be finished on the edge of the board from node's
        parent in the trie.

        Parameters:
        -----------
        board: 2-d list, the game board
        node: dictionary
            Represents current node in the trie
        row, column: ints, indices of board
        rack: dictionary
            The letters in the rack and the counts of each
        start_square: 2-tuple of ints
            The anchor square by which the created words are attached to
            the board
        tiles_played: list of single character strings
            The tiles played from the rack to reach the current node in the trie

        Returns:
        --------
        List of tuples describing words that could be finished on the edge of the
        board from node's parent.  Each tuple has the form
        (word, (start_square, end_square), tiles_played, score).

        """
        words = []
        row, column = board_position['position']
        board = board_position['board']
        tiles_played = rack_state['tiles_played']
        if TERMINAL in node.keys():
            if tiles_played:
                word = node[TERMINAL]
                start, end = (row, column-len(word)), (row, column-1)
                score = self.score_word(board, tiles_played, (start, end))
                words.append((word, (start, end), tiles_played, score))
        return words

    def build_words(self, node, board_position, rack_state):
        """
        Finds words that be built through board[row][column].

        Parameters:
        -----------
        node: dictionary
            Represents current node in the trie
        row, column: ints, indices of board
        remaining_tiles: dictionary
            The letters remaining in the rack and the counts of each
        start_square: 2-tuple of ints
            The anchor square by which the created words are attached to
            the board
        tiles_played: list of single character strings
            The tiles played from the rack to reach the current node in the trie

        Returns:
        --------
        List of tuples describing words that can be formed through
        board[row][column]. Each tuple has the form
        (word, (start_square, end_square), tiles_played, score).

        """
        row, column = board_position["position"]
        if not on_board(row, column):
            return self.finish_word_on_board_edge(node, board_position, rack_state)
        board = board_position["board"]
        letter = board.board[row][column]
        if letter:
            words = self.build_words_around_tile(node, board_position, rack_state)
        else:
            words = self.build_words_through_empty_square(node, board_position, rack_state)
        return words

    def find_across_words(self):
        """
        Returns a list of all of the across words that can be played on the board
        with the letters in the rack.

        Parameters:
        -----------
        board: 2-d list, the game board
        rack: dictionary with the counts of each letter in the rack

        """
        words = []
        for sq in self.board.anchor_squares:
            row, column = sq
            prefixes = self.find_legal_prefixes(self.board, row, column)
            for p in prefixes: # try to extend prefixes into full words
                node = p["node"]
                board_position = {'board': self.board,
                                  'position': sq,
                                  'anchor_square': sq,}
                rack_state = {'remaining_tiles': p['remaining_tiles'],
                              'tiles_played': p['tiles_played'],}
                words_from_prefix = self.build_words(node, board_position, rack_state)
                words.extend(words_from_prefix)
        return words

    def find_down_words(self):
        """
        Returns a list of all of the down words that can be played on the board
        with the letters in the rack.

        Parameters:
        -----------
        board_t: 2-d list, the game board transposed
        rack: dictionary with the counts of each letter in the rack

        """
        words = []
        for row, column in self.board_t.anchor_squares:
            prefixes = self.find_legal_prefixes(self.board_t, row, column)
            for p in prefixes: # try to extend prefixes into full words
                node = p["node"]
                board_position = {'board': self.board_t,
                                  'position': (row, column),
                                  'anchor_square': (row, column),}
                rack_state = {'remaining_tiles': p['remaining_tiles'],
                              'tiles_played': p['tiles_played'],}
                words_from_prefix = self.build_words(node, board_position, rack_state)
                words.extend(words_from_prefix)
        words = [transpose_word(word) for word in words]
        return words

    def find_highest_scoring_words(self):
        """
        Returns a list of tuples describing the highest scoring words that can be
        played given a board and a rack. Each tuple has the form
        (word, (start_square, end_square), tiles_played, score).

        Parameters:
        -----------
        board: 2d list, the game board
        rack: string, the letters in the rack

        """
        if not self.rack:
            print "The rack is empty, the fuck are you playing at m8"
            return []
        print "Size of prefixes:", asizeof(self.prefixes)
        across_words = self.find_across_words()
        down_words = self.find_down_words()
        print "Num across words:", len(across_words)
        print "Num down words:", len(down_words)
        all_words = list(set(across_words)) + list(set(down_words))
        return sorted(all_words, key=lambda w: w[3], reverse=True)

def init_dictionary(f):
    """
    Initialize word_list with words from specified file.
    Parameters:
    -----------
    f: string
        Name of file containing dictionary words.
    """
    with open(f, 'r') as word_file:
        for line in word_file:
            word = line.strip()
            key = "".join(sorted(word))
            if dictionary.get(key):
                dictionary[key].append(word)
            else:
                dictionary[key] = [word]

def init_trie():
    """
    Initializes the trie global variable as a dictionary-based trie.  Reads
    the dictionary global variable to construct the trie.
    """
    for key in dictionary:
        for word in dictionary[key]:
            node = trie
            for c in word:
                if node.get(c):
                    node = node[c]
                else:
                    node[c] = {}
                    node = node[c]
            node[TERMINAL] = word

def word_in_dict(word):
    """
    Looks up word in dictionary by using the word's sorted string form as a
    key.
    """
    key = "".join(sorted(word))
    if dictionary.get(key):
        words = dictionary[key]
        return word in words
    else:
        return False

def on_board(x, y):
    """
    Returns True if the Square specified by (x, y) is within the bounds of the
    scrabble board, and returns False otherwise.

    """
    return (0 <= x < BOARD_SIZE) and (0 <= y < BOARD_SIZE)

def get_squares_in_range(start, end):
    """
    Finds the entire range of squares from start to end inclusive.

    Parameters:
    -----------
    start, end: 2-tuple of ints
        Each tuple represents x,y coordinates of a square on the board

    Returns:
    --------
    squares: list of squares
        All of the squares from start to end inclusive if they are in the
        same row or column, empty list otherwise

    """
    if start > end: # To ensure anything read, is read from top to bottom, or
                    # from left to right, in accordance with Scrabble rules
        start, end = end, start
    start_x, end_x = start[0], end[0]
    start_y, end_y = start[1], end[1]
    squares = []
    if start_x == end_x: # Word is vertical
        for y in range(start_y, end_y+1):
            squares.append((start_x, y))
    elif start_y == end_y: # Word is horizontal
        for x in range(start_x, end_x+1):
            squares.append((x, start_y))
    else: # space range is diagonal and therefore invalid
        return None
    return squares

def find_bonus(square):
    """
    Returns a string detailing the bonus attached to a square on the game
    board. Returns None if the square does not have a bonus.

    """
    return WWF_BONUS_TILES.get(square)

def make_counter(rack):
    """
    Parameters:
    -----------
    rack: string
        A string containing the letters in the rack.

    Returns:
    --------
    counter: dictionary
        A dictionary with string keys corresponding to letters in the rack.
        The corresponding value is the count of that letter.

    """
    counter = {}
    for c in rack:
        if counter.get(c):
            counter[c] += 1
        else:
            counter[c] = 1
    return counter

def decrement_counter(counter, l):
    """
    Parameters:
    -----------
    counter: dictionary
        A dictionary with string keys corresponding to letters remaining in the
        rack and values corresponding to the count of each letter remaining.
    l: single-character string
        A letter being placed on the board and removed from the rack.

    Returns:
    --------
    c: dictionary
        A copy of the dictionary described above with 1 subtracted from l's
        count. If l's count drops to 0, it is popped from the dictionary.

    """
    c = counter.copy()
    c[l] -= 1
    if c[l] <= 0:
        c.pop(l, None)
    return c

def transpose_word(word_info):
    """
    Returns word_info with the position changed to what it would be if the
    board was transposed.

    Parameters:
    -----------
    word_info: tuple
        0th index is word in string form, 1st index is a 2-tuple
        ((start_row, start_column), (end_row, end_column)). 2nd index is a
        list of the tiles played to form the word, in order.  The 3rd index is
        the score from playing the word as prescribed.

    """
    word, location, tiles_played, score = word_info
    start_column, start_row = location[0]
    end_column, end_row = location[1]
    start = (start_row, start_column)
    end = (end_row, end_column)
    return (word, (start, end), tiles_played, score)

def find_creatable_words(trie, rack):
    """
    Returns a list of all of the words that can be made only using the letters
    in the rack.

    Parameters:
    -----------
    trie: dictionary
        Represents a trie made from all of the words in the dictionary
    rack: Counter
        The letters in the rack

    """
    rack = Counter(rack)
    return words_from_rack(trie, rack)

def place_word(word, start_square, direction=None):
    """Place word on board starting on start and going in direction."""
    row, column = start_square
    if direction == 'horizontal':
        if column + len(word) - 1 >= BOARD_SIZE: # word can't fit on board
            print "word", start_square, len(word)
            print "Word can't fit"
            return
        for c in word:
            if not board[row][column]:
                board[row][column] = c
                occupied_squares.append((row, column))
                score_board[row][column] = WWF_LET_VALUES[c]
                column += 1
                continue
            if board[row][column] != c:
                print "Word can't fit"
                return
            else:
                column += 1

    elif direction == 'vertical':
        if row + len(word) - 1 >= BOARD_SIZE: # word can't fit on board
            print word, start_square, len(word)
            print "Word can't fit, too long"
            return
        for c in word:
            if not board[row][column]:
                board[row][column] = c
                occupied_squares.append((row, column))
                score_board[row][column] = WWF_LET_VALUES[c]
                row += 1
                continue
            if board[row][column] != c:
                print word, board[row][column], c, (row, column)
                print "Word can't fit, mismatched letter"
                return
            else:
                row += 1

def main():
    init_dictionary(WORD_FILE)
    init_trie()
    b = Board([[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)])
    wf = WordFinder(b)
    display = Display(b, wf)
    display.run()

if __name__ == "__main__":
    # init_dictionary(WORD_FILE)
    # init_trie()
    # d = Display()
    # test_board = [[None for row in range(BOARD_SIZE)] for column in range(BOARD_SIZE)]
    # rack = "DJIKS__"
    # b = Board(test_board)
    # b.place_word("TRIOL", (7, 3), direction='horizontal')
    # b.place_word("INDIGO", (7, 5), direction='vertical')
    # b.place_word("LINTERS", (7, 7), direction='vertical')
    # b.place_word("WIFED", (8, 6), direction='horizontal')
    # d.print_board(b.board)
    # b.compute_cross_checks()
    # pp.pprint(b.cross_checks)
    # wf = WordFinder(b, rack)
    # pp.pprint(wf.find_highest_scoring_words()[:20])
    main()
    # rack = "VIIOUSD"
    # # place_word("TRIOL", (7, 3), direction='horizontal')
    # # place_word("INDIGO", (7, 5), direction='vertical')
    # # place_word("LINTERS", (7, 7), direction='vertical')
    # # place_word("WIFED", (8, 6), direction='horizontal')
    # place_word("DURAL", (7, 3), direction='horizontal')
    # place_word("ROMAINES", (7, 5), direction='vertical')
    # place_word("MODICA", (9, 5), direction='horizontal')
    # place_word("MESH", (14, 3), direction='horizontal')
    # place_word("PAIL", (4, 7), direction='vertical')
    # # print crossing_word_score(board, 3, 7, 'S', score_board, '2W')
    # print_board(board)
    # init_dictionary(WORD_FILE)
    # init_trie()
    # words = find_highest_scoring_words(board, rack)
    # pp.pprint(words[:50])
    # print "Num words:", len(words)
    # print_board(board)
    # main()
