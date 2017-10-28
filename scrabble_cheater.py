import re
from random import randrange
from scrabble_constants import WWF_LET_VALUES, WWF_BONUS_TILES, BONUS_TILE_COLORS
import sys
import random
import Tkinter as tk

BOARD_SIZE = 15
BLANK_TILE = "_"
occupied_squares = []
scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
dictionary = {}
WORD_FILE = "ospd.txt"

# Conventions:
# Specific vectors (rows or columns) are referenced with strings of the form
# "[r|c]x" where r or c specifies row or column and x specifies the index
# of the vector.

class ScrabbleCheater(object):

    def __init__(self):
        global init_dictionary
        global WORD_FILE
        init_dictionary(WORD_FILE)
        self.BOARD_SIZE = 15
        #self.board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        self.occupied_squares = []
        self.GUI = tk.Tk()

    def initialize_GUI(self):
        global WWF_BONUS_TILES
        self.board = tk.Frame(self.GUI)
        self.board.grid(row=1, column=1)
        # l = tk.Label(self.GUI, text="Scrabble Cheater")
        # l.pack()
        # self.GUI.title('Scrabble Cheater')
        self.GUI.geometry('600x600')
        for r in range(self.BOARD_SIZE):
            for c in range(self.BOARD_SIZE):
                square = (r, c)
                bonus = WWF_BONUS_TILES.get(square)
                color = BONUS_TILE_COLORS[bonus]
                e = tk.Entry(self.board, width=4, bg=color)
                e.grid(row=r, column=c)
        btn = tk.Button(self.GUI, text="Analyze", command=lambda: self.update_board(self.board, self.rack_entry))
        tk.Label(self.GUI, text="Enter rack of letters: ").grid(row=r+2, column=1,sticky='W')
        self.rack_entry = tk.Entry(self.GUI)
        self.rack_entry.grid(row=r+2, column=1, sticky='E')

        btn.grid(row=r+3)

    def update_board(self, board, rack_entry):
        global find_playable_words
        global scrabble_board
        global occupied_squares
        for child in board.children.values():
            r = int(child.grid_info()['row'])
            c = int(child.grid_info()['column'])
            val = child.get()
            if len(val) == 1:
                occupied_squares.append((r, c))
                scrabble_board[r][c] = val
        print_scrabble_board(scrabble_board)
        rack_letters = rack_entry.get()
        print rack_letters
        rack = list(rack_letters.upper())
        print rack
        words = find_playable_words(occupied_squares, rack)
        for word in words:
            print word
        print_scrabble_board(scrabble_board)
        scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
        occupied_squares = []

    def run(self):
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

def rack_has_all_letters(rack, word):
    """
    Returns True if the word contains all the letters in the rack. Returns
    False otherwise.

    Parameters:
    -----------
    rack: list of single-character strings
        The letters in the player's rack in any order.
    word: string
        Word from dictionary.

    """
    rack_copy = rack[:]
    for letter in word:
        if letter in rack_copy:
            rack_copy.remove(letter)
        elif BLANK_TILE in rack_copy:
            rack_copy.remove(BLANK_TILE)
        else:
            return False
    return True

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

def find_words(rack, dictionary):
    """
    Find words that can be played with the letters in the rack.

    Parameters:
    -----------
    rack: list of single-character strings
        The letters in the player's rack in any order.
    word_list: list of strings
        List of dictionary words

    Returns:
    --------
    playable_words: list of strings
        Words that can be played with the letters in the rack.

    """
    playable_words = []
    for key in dictionary:
        rack_copy = rack[:]
        rack_has_all_letters = True
        for letter in key:
            if letter in rack_copy:
                rack_copy.remove(letter)
            elif BLANK_TILE in rack_copy:
                rack_copy.remove(BLANK_TILE)
            else:
                rack_has_all_letters = False
                break
        if rack_has_all_letters:
            playable_words.extend(dictionary[key])
    return playable_words

def score_word(word, rack=None, location=None):
    """
    Returns the cumulative Scrabble score of the letters in word.
    """
    score = 0
    if rack and location:
        inds = get_indices_of_letters(location)
        letters = [x[0] for x in inds]
        rack = rack + letters
    for letter in word:
        if rack:
            if letter in rack:
                score += WWF_LET_VALUES[letter]
        else:
            score += WWF_LET_VALUES[letter]
    return score

def sort_words_by_score(word_list, rack, location):
    """
    Sorts the words in the input list by their cumulative letter value in
    Scrabble.

    Parameters:
    -----------
    word_list:
        List of dictionary words, likely the only the ones that can be played
        with a certain rack of letters.

    Returns:
    --------
    word_scores: list of tuples
        Each tuple has the form (word, word_score), where word is a word from
        the input word_list and word_score is the word's cumulative letter
        value in Scrabble.  There is one tuple for each word in the input
        list.

    """
    word_scores = [{'word': word, 'score': score_word(word, rack=rack, location=location)} \
                   for word in word_list]
    word_scores = sorted(word_scores, key=lambda word: word['score'], reverse=True)
    return word_scores

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

def word_from_squares(squares):
    """
    Returns the word formed by concatenating the letters on each square in
    squares.

    Parameters:
    -----------
    squares: list of 2-tuple x,y coordinates

    """
    word = ""
    for square in squares:
        x, y = square[0], square[1]
        char = scrabble_board[x][y]
        if char:
            word += char
        else:
            return ""
    return word

def find_words_including(square, directions = None):
    """
    Finds words that include the input square, if any exist.

    Parameters:
    -----------
    square: tuple of ints representing coordinates
    directions: list of strings
        If 'horizontal' is in directions, looks for a word containing square
        in square's row.  If 'vertical' is in directions, looks for a word
        containing square in square's column.
    Returns:
    --------
    word: string or None
        A word on the scrabble board with a letter on square, or None, if a
        word was not found.

    """
    word = None
    x, y = square[0], square[1]
    if 'horizontal' in directions: # if word is horizontal, find words
                                   # crossing vertically
        # Check tiles in vertical line including square
        top_x = bottom_x = x
        while on_board(top_x, y) and scrabble_board[top_x][y]:
            top_x -= 1
        top_x += 1 # increment to last valid value

        while on_board(bottom_x, y) and scrabble_board[bottom_x][y]:
            bottom_x += 1
        bottom_x -= 1 # decrement to last valid value

        top_square = (top_x, y)
        bottom_square = (bottom_x, y)
        vertical_squares = get_squares_in_range(top_square, bottom_square)
        word = word_from_squares(vertical_squares)

    elif 'vertical' in directions:
        # Check tiles in horizontal line including square
        left_y = right_y = y
        while on_board(x, left_y) and scrabble_board[x][left_y]:
            left_y -= 1
        left_y += 1

        while on_board(x, right_y) and scrabble_board[x][right_y]:
            right_y += 1
        right_y -= 1

        leftmost_square = (x, left_y)
        rightmost_square = (x, right_y)
        horizontal_squares = get_squares_in_range(leftmost_square, rightmost_square)
        word = word_from_squares(horizontal_squares)

    return word

def print_scrabble_board(scrabble_board):
    for index, row in enumerate(scrabble_board):
        print index, row
    print

def get_rack():
    """
    Prompts the user to input their rack of letters.  Returns the rack in
    string form.

    """
    while True:
            letters = raw_input("Please enter the letters in the rack: ")
            if letters == "":
                break
            elif (len(letters) > 7):
                print "You entered an invalid number of characters."
                print "Please try again."
            elif not letters.isalpha():
                print "Some of the characters you entered arent valid Scrabble tiles."
                print "Please try again."
            else:
                break
    rack = list(letters.upper())
    return rack

def find_playable_words(occupied_squares, rack):
    """
    Finds all words that may, and many that may not, be played with a current
    board state and a rack of letters.

    Parameters:
    -----------
    occupied_squares: list of 2-tuples
        (row, column) coordinates representing all of the squares on the board
        where letters are placed.
    rack: list of single-character strings
        The letters in the player's rack in any order.

    Returns:
    --------
    playable_words: dictionary with string keys and list values
        Each key string starts with 'r' or 'c' for row or column respectively
        and which is followed by a number specifing the row or column index.
        The list contains all of the words that can be played with the
        letters on the board and in the rack.

    """
    potential_words = {}
    left_most_square = min(occupied_squares, key=lambda x: x[1])
    right_most_square = max(occupied_squares, key=lambda x: x[1])
    top_square = min(occupied_squares, key=lambda x: x[0])
    bottom_square = max(occupied_squares, key=lambda x: x[0])

    left_boundary = left_most_square[1]
    if left_boundary > 0:
        left_boundary -= 1
    right_boundary = right_most_square[1]
    if right_boundary < BOARD_SIZE - 1:
        right_boundary += 1

    for column in range(left_boundary, right_boundary+1):
        key = "c" + str(column)
        potential_words[key] = []
        rack_copy = rack[:]
        for row in range(BOARD_SIZE):
            letter = scrabble_board[row][column]
            if letter:
                rack_copy.append(letter)
        possible_words = find_words(rack_copy, dictionary)
        potential_words[key].extend(possible_words)

    top_boundary = top_square[0]
    if top_boundary > 0:
        top_boundary -= 1
    bottom_boundary = bottom_square[0]
    if bottom_boundary < BOARD_SIZE - 1:
        bottom_boundary += 1
    for row in range(top_boundary, bottom_boundary+1):
        key = "r" + str(row)
        potential_words[key] = []
        rack_copy = rack[:]
        for column in range(BOARD_SIZE):
            letter = scrabble_board[row][column]
            if letter:
                rack_copy.append(letter)
        possible_words = find_words(rack_copy, dictionary)
        potential_words[key].extend(possible_words)
    playable_words = []
    for vector, words in potential_words.iteritems():
        for word in words:
            r = []
            result = fit_word(word, rack, vector)
            playable_words.extend(result)
    playable_words = sort_by_score(playable_words)
    return playable_words[:10]

def sort_by_score(playable_words):
    words_by_score = sorted(playable_words, key=lambda word: word['score'], reverse=True)
    return words_by_score

def get_indices_of_letters(location):
    """
    Returns all of the letters in the vector (row or column) specified by
    location along with their indices.

    Parameters:
    -----------
    location: string

    Returns:
    --------
    letters_and_indices: list of tuples
        Each tuple has the form (character, index) where character is a letter
        in the alphabet and index is its position in the vector.

    """
    letters_and_indices = []
    if location[0] == 'r':
        row = int(location[1:])
        for column in range(BOARD_SIZE):
            letter = scrabble_board[row][column]
            if letter:
                index = column
                letters_and_indices.append((letter, index))
    elif location[0] == 'c':
        column = int(location[1:])
        for row in range(BOARD_SIZE):
            letter = scrabble_board[row][column]
            if letter:
                index = row
                letters_and_indices.append((letter, index))
    return letters_and_indices

def word_crossing_letter(letter, square, direction):
    """
    Determines if a letter can be placed on a square without clashing without
    surrounding squares.

    Parameters:
    -----------
    letter: string
        Alphabet letter.
    square: (row, column) tuple
    direction: string
        'vertical' to check if the letter clashes with tiles in its column.
        'horizontal' to check if the letter clashes with tiles in its row.
    crossing_words: list of strings
        A list of words that the letter's containing word intersects with.
    squares_to_erase: list of (row, column) tuples
        Empty squares on the board that were filled in by hypothetical moves.
        Will be erased when no longer needed.

    Returns:
    --------
    True if the letter can legally be placed on the square, False otherwise.

    """
    row, column = square
    crossing_word = find_words_including(square, directions=direction)
    if len(crossing_word) == 1:
        return crossing_word
    c_word_in_dict = word_in_dict(crossing_word, dictionary)
    if c_word_in_dict:
        return crossing_word
    else:
        return None

def find_bonus(square):
    return WWF_BONUS_TILES.get(square)

def calc_word_score(word, rack, location, start):
    """
    Determines if a word can legally be played on a vector on the scrabble
    board.

    Parameters:
    -----------
    word: string
    location
    rack: list of single-character strings
        The letters in the player's rack in any order.
    start: (row, column) tuple
        Square on the board to place first letter of word.

    Returns:
    --------
    True if the word can legally be played along the vector specified by
    location, starting at the start square, False otherwise.

    """
    word_can_fit = True
    rack_copy = rack[:]
    word_ind = 0
    x = int(location[1:])
    word_score = 0
    score_multiplier = 1
    crossing_words = []
    crossing_word_scores = []
    squares_to_erase = []
    overlaps_letter = False
    if location[0] == 'r': # fit word horizontally
        start_square = (x, start)
        direction = ['horizontal']
    elif location[0] == 'c': # fit word vertically
        start_square = (start, x)
        direction = ['vertical']
    for y in range(start, start+len(word)):
        if location[0] == 'r': # fit word horizontally
            square = (x, y)
        elif location[0] == 'c': # fit word vertically
            square = (y, x)
        row, column = square
        if on_board(row, column) and not scrabble_board[row][column]:
            letter = word[word_ind]
            scrabble_board[row][column] = letter
            letter_value = WWF_LET_VALUES[letter]
            squares_to_erase.append(square)
            bonus = find_bonus(square)
            crossing_word = word_crossing_letter(letter, square, direction)
            if not crossing_word:
                erase_squares(squares_to_erase)
                return None
            crossing_word_score = 0
            if len(crossing_word) > 1:
                crossing_word_score = score_word(crossing_word)
                crossing_words.append(crossing_word)
            if bonus:
                multiplier = int(bonus[0])
                if bonus[1] == 'W':
                    crossing_word_score *= multiplier
                    score_multiplier *= multiplier
                elif bonus[1] == 'L':
                    if len(crossing_word) > 1:
                        crossing_word_score += letter_value * (multiplier - 1)
                    letter_value *= multiplier
            # if word == "PIVOTAL" and start_square == (0, 3):
                # print "Letter:", letter, "Value:", letter_value, "Multiplier:", score_multiplier, "Crossing word:", crossing_word, "Crossing word score:", crossing_word_score
            word_score += letter_value
            crossing_word_scores.append(crossing_word_score)
            try:
                rack_copy.remove(letter)
            except ValueError: # not enough letters to make word
                if BLANK_TILE in rack_copy:
                    rack_copy.remove(BLANK_TILE)
                else:
                    erase_squares(squares_to_erase)
                    return None
            word_ind += 1
        elif on_board(row, column) and scrabble_board[row][column] == word[word_ind]:
            overlaps_letter = True
            letter = scrabble_board[row][column]
            letter_value = WWF_LET_VALUES[letter]
            word_score += letter_value
            word_ind += 1
            continue
        else:
            erase_squares(squares_to_erase)
            return None
    if not (crossing_words or overlaps_letter):
        erase_squares(squares_to_erase)
        return None
    # make sure completed word is in the dictionary
    if location[0] == 'r':
        end_square = (x, y)
        direction = ['vertical']
    elif location[0] == 'c':
        end_square = (y, x)
        direction = ['horizontal']
    finished_word = find_words_including(end_square, directions=direction)
    # if word == "PIVOTAL":
    #     print "Finished word:", finished_word, "Location:", start_square, end_square
    if not word_in_dict(finished_word, dictionary):
        # if word == "PIVOTAL":
        #     print "Finished word not in dict"
        erase_squares(squares_to_erase)
        return None
    word_score *= score_multiplier
    for score in crossing_word_scores:
        word_score += score
    # if word == "PIVOTAL":
    #     print "Rack Length:", len(rack), "Rack Copy:", rack_copy
    if (len(rack) == 7) and (not rack_copy):
        word_score += 50
    loc_and_score = {'word': word,
                     'location':(start_square, end_square),
                     'score': word_score}
    erase_squares(squares_to_erase)
    return loc_and_score

def location_and_score(word, rack, location, square, start, crossing_words):
    """
    Finds all the locations where a word can legally be played along the
    vector specified by location, along by the score from playing the word
    there.

    Parameters:
    -----------
    word: string
    location: string
    square: (row, column) tuple
    start: int
        Index of first letter of word in vector.
    crossing_words: list of strings
        A list of words that the letter's containing word intersects with.

    Returns:
    --------
    loc: dictionary with string keys
        The 'location' key has a corresponding 2-tuple of
        (starting_square, ending_square) where starting_square and
        ending_square are the squares on which the first and last letters
        of the word are played respectively.
        The 'score' key holds the points gained by playing the word.

    """
    row, column = square
    if location[0] == 'r':
        starting_square = (row, start)
        ending_square = (row, start+len(word)-1)
    elif location[0] == 'c':
        starting_square = (start, column)
        ending_square = (start+len(word)-1, column)
    squares = (starting_square, ending_square)
    word_score = score_word(word, rack=rack, location=location)
    for w in crossing_words:
        word_score += score_word(w)
    # crossing_words[:] = []
    loc = {'location': squares, 'score': word_score}
    return loc

def erase_squares(squares_to_erase):
    """
    Overwrites value of each square in squares_to_erase with None.

    Parameters:
    -----------
    squares_to_erase: list of (row, column) 2-tuples

    """
    for tile in squares_to_erase:
        x, y = tile
        scrabble_board[x][y] = None
    squares_to_erase[:] = []

def fit_word_in_vector(word, rack, location):
    vector = int(location[1:])
    locations = []
    for start in range(BOARD_SIZE-len(word)+1):
        loc_and_score = calc_word_score(word, rack, location, start)
        if loc_and_score:
            locations.append(loc_and_score)
    return locations

def find_possible_locations(word, rack, location, letters_and_indices):
    """
    Finds all of the possible locations where a word can be played along
    the vector specified by location.

    Parameters:
    -----------
    word: string
    rack: list of single-character strings
        The letters in the player's rack in any order.
    location: string
    letters_and_indices: list of tuples
        Each tuple has the form (character, index) where character is a letter
        in the alphabet and index is its position in the vector.

    Returns:
    --------
    possible_locations: dictionary
        Contains word and all of the locations where word can be played along
        the vector specified by location, along with the scores from playing
        the word there.

    """
    possible_locations = []
    vector = int(location[1:]) # column or row to attempt to fit word into
    start_locations = [] # squares where we have attempted to start the word
                        # by placing first letter, we won't try the same place
                        # more than once
    locations = fit_word_in_vector(word, rack, location)
    r = []
    for loc in locations:
        score = loc['score']
        l = loc['location']
        result = {'word': word, 'score': score, 'location': l}
        r.append(result)
    possible_locations.extend(locations)
    return possible_locations

def fit_word(word, rack, location):
    """
    Attempts to fit word into a location (particular row or column) on the
    scrabble_board, returns the word, and the squares in which its letters
    will be placed if it can fit, returns None otherwise

    Parameters:
    -----------
    word: string
        A dictionary word
    rack: list of single-character strings
        The letters in the player's rack in any order.
    location: string
        First letter (either "r" or "c") determines whether the location is a
        row or a column, the next digits determine which row or column to work
        with.

    Returns:
    --------
    possible_locations: dictionary
        Contains word and all of the locations where word can be played along
        the vector specified by location, along with the scores from playing
        the word there.

    """
    letters_and_indices = get_indices_of_letters(location) # indices of
                            # letter in row
    possible_locations = find_possible_locations(word, rack, location, letters_and_indices)
    return possible_locations


def find_all_indices(letter, word):
    """
    Parameters:
    -----------
    letter: single-character string
    word: string
        Dictionary word

    Returns:
    --------
    indices: list of ints
        A list of all the indices where letter occurs in word

    """
    indices = [index for index, char in enumerate(word) if char == letter]
    return indices

if __name__ == "__main__":
    sc = ScrabbleCheater()
    sc.run()
