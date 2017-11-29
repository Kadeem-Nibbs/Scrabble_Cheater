import Tkinter as tk
import pickle
from scrabble_constants import WWF_LET_VALUES, WWF_BONUS_TILES, BONUS_TILE_COLORS
from collections import Counter
from profilehooks import profile
from pprint import PrettyPrinter
pp = PrettyPrinter()

BOARD_SIZE = 15
BLANK_TILE = "_"
ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
TERMINAL = '$' # denotes the end of a word in trie
WORD_FILE = "ENABLE.txt" # Enhanced North American Benchmark Lexicon with
                         # with a few hundred additions of more modern words
                         # and about 100 deletions of offensive words made by
                         # Zynga
EMPTY_BOARD = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
score_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
occupied_squares = []
dictionary = {} # for checking if a word is in dictionary
trie = {} # for seeing what words can be made on the board with rack

class ScrabbleCheater(object):

    def __init__(self):
        global init_dictionary
        global WORD_FILE
        global init_trie
        init_dictionary(WORD_FILE)
        init_trie()
        self.BOARD_SIZE = 15
        self.occupied_squares = []
        self.GUI = tk.Tk()

    def initialize_GUI(self):
        """
        Initialize displayed board to showed letters from board variable.  Set
        the colors of each square according to the bonus it contains.

        """
        global WWF_BONUS_TILES
        global WWF_LET_VALUES
        global occupied_squares
        global board
        self.board = tk.Frame(self.GUI)
        self.board.grid(row=1, column=1)
        self.GUI.geometry('600x600')
        for r in range(self.BOARD_SIZE):
            for c in range(self.BOARD_SIZE):
                square = (r, c)
                bonus = WWF_BONUS_TILES.get(square)
                color = BONUS_TILE_COLORS[bonus]
                content = tk.StringVar()
                if board[r][c]:
                    letter = board[r][c]
                    occupied_squares.append((r,c))
                    score_board[r][c] = WWF_LET_VALUES[letter]
                    content.set(letter)
                e = tk.Entry(self.board, width=4, bg=color, textvariable=content)
                e.grid(row=r, column=c)

        btn = tk.Button(self.GUI, text="Analyze", command=lambda: self.display_words(self.rack_entry))
        tk.Label(self.GUI, text="Enter rack of letters: ").grid(row=r+2, column=1,sticky='W')
        self.rack_entry = tk.Entry(self.GUI)
        self.rack_entry.grid(row=r+2, column=1, sticky='E')

        btn.grid(row=r+3)

    def display_words(self, rack_entry):
        """
        Sets board and rack using values from the respective entry slots.  Uses
        these to find and display the highest scoring words that can be played.
        Resets the board to the empty state after every run.

        Parameters:
        -----------
        rack_entry: tk.Entry
            The tk widget where the rack letters are entered.

        """
        global find_playable_words
        global board
        global occupied_squares
        global compute_cross_checks
        occupied_squares = []
        for child in self.board.children.values():
            r = int(child.grid_info()['row'])
            c = int(child.grid_info()['column'])
            val = child.get()
            if len(val) == 1:
                occupied_squares.append((r, c))
                letter = val.upper()
                board[r][c] = letter
                score_board[r][c] = WWF_LET_VALUES[letter]
            elif len(val) == 2:
                if val[1] == '*':
                    occupied_squares.append((r, c))
                    letter = val[0].upper()
                    board[r][c] = letter
                    score_board[r][c] = 0
        print_board(board)
        rack_letters = rack_entry.get()
        rack = list(rack_letters.upper())
        words = find_highest_scoring_words(board, rack)[:50]
        for word in words:
            print word
        print
        board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        occupied_squares = []

    def run(self):
        """
        Wait for input board states and racks from the user.  Respond to
        pressed Analyze button with top 50 highest scoring words that can be
        played in the scenario.

        """
        self.initialize_GUI()
        self.GUI.mainloop()

def init_dictionary(f):
    """
    Initialize word_list with words from specified file.

    Parameters:
    -----------
    f: string
        Name of file containing dictionary words.

    """
    global dictionary
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
    global dictionary
    global trie
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

def empty_and_not_preceded_by_letter(board, row, column):
    """
    Returns True if board[row][column] contains None (a letter has not been
    played there) and is not preceded by a square, board[row][column-1], which
    holds a letter.  Returns False otherwise.

    """
    if not on_board(row, column):
        return False
    if board[row][column]:
        return False
    if not on_board(row, column-1):
        return True
    if not board[row][column-1]:
        return True
    else:
        return False

def find_anchor_squares_near(board, row, column):
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
    # if not (on_board(row, column-1)):
    #     anchor_squares.append((row, column))
    candidate_squares = [(row, column), (row-1, column), (row+1, column)]
    for square in candidate_squares:
        if square == (row, column):
            if on_board(row, column-1) and not board[row][column-1]:
                anchor_squares.append(square)
        if empty_and_not_preceded_by_letter(board, *square):
            anchor_squares.append(square)
    return anchor_squares

def get_anchor_squares(board):
    """
    Returns a list of all of the anchor squares on the board.

    """
    anchor_squares = []
    for square in occupied_squares:
        adjacent_anchor_squares = find_anchor_squares_near(board, *square)
        anchor_squares.extend(adjacent_anchor_squares)
    return anchor_squares

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

def decremented_counter(counter, l):
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

def make_prefixes(node, row, column, rack, spaces_left, pref, tiles_played):
    """
    A prefix in this application is a valid beginning to a word that can be
    played in the squares to the left of an anchor square.
    Returns a list of all of the prefixes that can be continued from a node in
    the trie, given the number of spaces remaining to the left of
    the anchor square board[row][column].

    Parameters:
    -----------
    node: dictionary
        Each key is a letter l that can be played to continue a prefix, the
        corresponding value of each is a dictionary containing letters that can
        be played after l to continue the prefix further.
    row, column: integer indices of 2d list
    rack: dictionary used as makeshift counter for letters remaining in rack
    spaces_left: int
        Number of letters remaining to continue prefixes.
    pref: string
        The letters in the prefix already, in order played.
    tiles_played: list of strings
        The tiles put down to construct the prefix, in order played.

    Returns:
    --------
    prefixes: list of tuples
        The 0th index of each tuple is a dictionary like node described
        above, but will later be used to complete words not just form prefixes.
        The 1st index is a dictionary with the counts of letters remaining
        in the rack.  The 2nd index is a list of the tiles played to form the
        prefix in order.

    """
    prefixes = []
    if is_valid_prefix(board, pref, row, column):
        prefixes.append((node, rack, tiles_played))
    if spaces_left < 1:
        return prefixes
    for l in node.keys():
        if l == TERMINAL: # We can't always us complete words as prefixes, if
                          # the corresponding anchor square is empty,they may
                          # not touch a letter already on the board.
            continue
        if l in rack:
            next_node = node[l]
            new_rack = decremented_counter(rack, l)
            prefixes.extend(make_prefixes(next_node, row, column, new_rack, spaces_left-1, pref+l, tiles_played+tuple(l)))
        if BLANK_TILE in rack:
            next_node = node[l]
            new_rack = decremented_counter(rack, BLANK_TILE)
            prefixes.extend(make_prefixes(next_node, row, column, new_rack, spaces_left-1, pref+l, tiles_played+tuple(BLANK_TILE)))
    return prefixes

def is_valid_prefix(board, prefix, row, column):
    """
    Returns True if the letters in the proposed prefix, with the last letter
    at board[row][column-1] would not form illegal vertical words with letters
    already on the board. Returns False otherwise.

    Parameters:
    -----------
    board: 2d list, the game board
    prefix: string
        The beginnings of a word that may be playable on the board.
    row, column: integer indices of board

    """
    size = len(prefix)
    for i in range(size):
        if not can_play_letter(board, row, column-(size-i), prefix[i]):
            return False
    return True

def get_all_prefixes(board, row, column, rack):
    """
    Parameters:
    -----------
    board: 2d list, the scrabble_board
    row, column: integer indices of 2d list
    rack: string, the letters in the rack

    Returns:
    --------
    prefixes: list of tuples, beginnings to all words that can be played
              through board[row][column]
        The 0th index of each tuple is a dictionary with different iterable
        paths, each '$' key encountered denotes and contains a complete word as
        a value. The 1st index is a dictionary with the counts of letters
        remaining in the rack.  The 2nd index is a list of the tiles played to
        form the prefix in order.

    """
    rack_length = len(rack)
    rack = make_counter(rack)
    free_spaces_to_left = 0
    r, c = row, column
    while on_board(r, c): # count empty squares to the left of board[row][column]
                          # to determine how long prefixes can be
        if not on_board(r, c-1):
            break
        if not board[r][c-1]:
            c -= 1
            free_spaces_to_left += 1
        else: # found a letter on the board, go back one space
            free_spaces_to_left -= 1
            break
    free_spaces_to_left = min(free_spaces_to_left, rack_length)
    prefixes = make_prefixes(trie, row, column, rack, free_spaces_to_left, "", ())
    return prefixes

def find_across_words(board, rack):
    """
    Returns a list of all of the across words that can be played on the board
    with the letters in the rack.

    Parameters:
    -----------
    board: 2-d list, the game board
    rack: dictionary with the counts of each letter in the rack

    """
    words = []
    anchor_squares = get_anchor_squares(board)
    for sq in anchor_squares:
        row, column = sq
        prefixes = get_all_prefixes(board, row, column, rack)
        for p in prefixes: # try to extend prefixes into full words
            prefix, _rack, tiles_played = p
            words.extend(build_words(board, prefix, row, column, _rack, sq, tiles_played))
    return words

def find_down_words(board_t, rack):
    """
    Returns a list of all of the down words that can be played on the board
    with the letters in the rack.

    Parameters:
    -----------
    board_t: 2-d list, the game board transposed
    rack: dictionary with the counts of each letter in the rack

    """
    words = []
    anchor_squares = get_anchor_squares(board_t)
    for sq in anchor_squares:
        row, column = sq
        prefixes = get_all_prefixes(board_t, row, column, rack)
        for p in prefixes:
            prefix, _rack, tiles_played = p
            words.extend(build_words(board_t, prefix, row, column, _rack, sq, tiles_played))
    words = [transpose_word(word) for word in words]
    return words

@profile
def find_highest_scoring_words(board, rack):
    """
    Returns a list of tuples describing the highest scoring words that can be
    played given a board and a rack. Each tuple has the form
    (word, (start_square, end_square), tiles_played, score).

    Parameters:
    -----------
    board: 2d list, the game board
    rack: string, the letters in the rack

    """
    global score_board
    global cross_checks
    global occupied_squares
    compute_cross_checks(board)
    words = []
    across_words = find_across_words(board, rack)
    words.extend(across_words)
    # transpose the board, repeat process to find down words
    board_t = transposed_board(board)
    score_board = transposed_board(score_board)
    occupied_squares = []
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if letter:
                occupied_squares.append((i, j))
    compute_cross_checks(board_t) # recompute cross checks for transposed board
    down_words = find_down_words(board_t, rack)
    words.extend(down_words)
    return sorted(list(set(words)), key=lambda w: w[3], reverse=True)

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

def build_words_around_tile(board, node, row, column, rack, start_square, tiles_played):
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
    letter = board[row][column]
    words = []
    if letter in node.keys():
        words.extend(build_words(board, node[letter], row, column+1, rack,\
                     start_square, tiles_played))
    return words

def build_words_through_empty_square(board, node, row, column, rack, start_square, tiles_played):
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
    for letter in node.keys():
        if letter == TERMINAL:
            if tiles_played and (row, column) != start_square:
                word = node[TERMINAL]
                start, end = (row, column-len(word)), (row, column-1)
                score = score_word(board, tiles_played, start, end)
                words.append((word, (start, end), tiles_played, score))
            continue
        if not can_play_letter(board, row, column, letter):
            continue
        if letter in rack:
            words.extend(build_words(board, node[letter], row, column+1,\
                        decremented_counter(rack, letter), start_square, tiles_played+tuple(letter)))
        if BLANK_TILE in rack:
            words.extend(build_words(board, node[letter], row, column+1,\
                        decremented_counter(rack, BLANK_TILE), start_square, tiles_played+tuple(BLANK_TILE)))
    return words

def square_has_no_vertical_neighbors(board, x, y):
    """
    Returns True if neither board[x-1][y] nor board[x+1][y] holds a letter.
    Returns False otherwise.

    """
    if not on_board(x-1, y):
        if not board[x+1][y]:
            return True
    elif not on_board(x+1, y):
        if not board[x-1][y]:
            return True
    else:
        if not (board[x+1][y] or board[x-1][y]):
            return True

def get_adjacent_empty_squares(board, row, column):
    """Returns all empty squares adjacent to board[row][column] in a list."""
    adjacent_squares = []
    for r, c in ((row+1, column), (row-1, column), \
                        (row, column+1), (row, column-1)):
        if on_board(r, c) and not board[r][c]:
            adjacent_squares.append((r, c))
    return adjacent_squares

def compute_cross_checks(board):
    """
    Computes all of the letters that can be played on each square on the board
    without creating an illegal vertical word, places them in the global
    "cross_checks" dictionary.  If a square isn't in the dictionary, then any
    letter can be played at that square.

    """
    global cross_checks
    cross_checks = {}
    cross_check_squares = []
    for square in occupied_squares:
        cross_check_squares.extend(get_adjacent_empty_squares(board, *square))
    cross_check_squares = list(set(cross_check_squares))
    for square in cross_check_squares:
        row, column = square
        upper_part = lower_part = ""
        upper_r = row - 1
        lower_r = row + 1
        while on_board(upper_r, column) and board[upper_r][column]:
            upper_part = board[upper_r][column] + upper_part
            upper_r -= 1
        while on_board(lower_r, column) and board[lower_r][column]:
            lower_part = lower_part + board[lower_r][column]
            lower_r += 1
        if not (lower_part or upper_part):
            continue
        check_string = upper_part + "%s" + lower_part
        cross_checks[square] = set()
        for c in ALPHABET:
            possible_word = check_string % c
            if word_in_dict(possible_word, dictionary):
                cross_checks[square] |= set(c)

def can_play_letter(board, x, y, letter):
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
    if not (x, y) in cross_checks:
        return True
    possible_letters = cross_checks.get((x, y))
    return letter in possible_letters

def finish_word_on_board_edge(board, node, row, column, rack, start_square, tiles_played):
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
    if TERMINAL in node.keys():
        if tiles_played:
            word = node[TERMINAL]
            start, end = (row, column-len(word)), (row, column-1)
            score = score_word(board, tiles_played, start, end)
            words.append((word, (start, end), tiles_played, score))
    return words

def build_words(board, node, row, column, rack, start_square, tiles_played):
    """
    Finds words that be built through board[row][column].

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
    List of tuples describing words that can be formed through
    board[row][column]. Each tuple has the form
    (word, (start_square, end_square), tiles_played, score).

    """
    words = []
    if not on_board(row, column):
        return finish_word_on_board_edge(board, node, row, column, rack, start_square, tiles_played)
    letter = board[row][column]
    if letter:
        words.extend(build_words_around_tile(board, node, row, column, rack,\
                     start_square, tiles_played))
    else:
        words.extend(build_words_through_empty_square(board, node, row, column, rack,\
                     start_square, tiles_played))
    return words

def crossing_word_score(board, row, column, letter, score_board, bonus):
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

def part_of_vertical_word(board, row, column):
    """
    Returns True if either of board[x-1][y] and board[x+1][y] holds a letter.
    Returns False otherwise.

    """
    if on_board(row+1, column) and board[row+1][column]:
        return True
    elif on_board(row-1, column) and board[row-1][column]:
        return True
    else:
        return False

def score_word(board, tiles_played, start_square, end_square):
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
    for row, column in get_squares_in_range(start_square, end_square):
        letter = board[row][column]
        if letter:
            score += WWF_LET_VALUES[letter]
            continue
        letter = tiles_played[tiles_played_index]
        tiles_played_index += 1
        bonus = find_bonus((row, column))
        if bonus:
            if part_of_vertical_word(board, row, column):
                cw_score = crossing_word_score(board, row, column, letter, score_board, bonus)
                crossing_word_scores.append(cw_score)
            if bonus[1] == 'L':
                score += WWF_LET_VALUES[letter] * int(bonus[0])
            elif bonus[1] == 'W':
                score += WWF_LET_VALUES[letter]
                multiplier *= int(bonus[0])
        else:
            score += WWF_LET_VALUES[letter]
            if part_of_vertical_word(board, row, column):
                cw_score = crossing_word_score(board, row, column, letter, score_board, bonus)
                crossing_word_scores.append(cw_score)
    score *= multiplier
    score += sum(crossing_word_scores)
    if len(tiles_played) == 7:
        score += 30
    return score

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

def word_in_dict(word, dictionary):
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

def print_board(board):
    for index, row in enumerate(board):
        print index, row
    print

def find_bonus(square):
    """
    Returns a string detailing the bonus attached to a square on the game
    board. Returns None if the square does not have a bonus.
    
    """
    return WWF_BONUS_TILES.get(square)

def transposed_board(board):
    return zip(*board)

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
    sc = ScrabbleCheater()
    sc.run()

if __name__ == "__main__":
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

    main()
