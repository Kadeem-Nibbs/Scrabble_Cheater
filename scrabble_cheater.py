import re
from random import randrange
from letters import LETTER_VALUES, SCRABBLE_TILES
import sys
import random

BOARD_SIZE = 15
occupied_squares = []
scrabble_board = [[None for x in range(BOARD_SIZE)] for y in range(BOARD_SIZE)]
dictionary = {}
WORD_FILE = "words.txt"

# Conventions:
# Specific vectors (rows or columns) are referenced with strings of the form
# "[r|c]x" where r or c specifies row or column and x specifies the index
# of the vector.

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
            else:
                rack_has_all_letters = False
                break
        if rack_has_all_letters:
            playable_words.extend(dictionary[key])
    return playable_words

def score_word(word):
    """
    Returns the cumulative Scrabble score of the letters in word.
    """
    score = 0
    for letter in word:
        score += LETTER_VALUES[letter]
    return score

def sort_words_by_score(word_list):
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
    word_scores = [{'word': word, 'score': score_word(word)} \
                   for word in word_list]
    # word_scores = [(word, score_word(word)) for word in word_list]
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
    if 'horizontal' in directions:
        # Check tiles in horizontal line including square
        left_x = right_x = x
        while on_board(left_x, y) and scrabble_board[left_x][y]:
            left_x -= 1
        left_x += 1 # increment to last valid value

        while on_board(right_x, y) and scrabble_board[right_x][y]:
            right_x += 1
        right_x -= 1 # decrement to last valid value

        leftmost_square = (left_x, y)
        rightmost_square = (right_x, y)
        horizontal_squares = get_squares_in_range(leftmost_square, rightmost_square)
        word = word_from_squares(horizontal_squares)

    elif 'vertical' in directions:
        # Check tiles in vertical line including square
        top_y = bottom_y = y
        while on_board(x, top_y) and scrabble_board[x][top_y]:
            top_y -= 1
        top_y += 1

        while on_board(x, bottom_y) and scrabble_board[x][bottom_y]:
            bottom_y += 1
        bottom_y -= 1

        top_square = (x, top_y)
        bottom_square = (x, bottom_y)
        vertical_squares = get_squares_in_range(top_square, bottom_square)
        word = word_from_squares(vertical_squares)

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
    rack: string
        The letters in the player's rack.

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
            result = fit_word(word, vector)
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

def letter_can_fit(letter, square, direction, crossing_words, squares_to_erase):
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
        return True
    c_word_in_dict = word_in_dict(crossing_word, dictionary)
    if c_word_in_dict:
        crossing_words.append(crossing_word)
        return True
    else:
        return False

def can_fit(word, location, start, squares_to_erase, crossing_words):
    """
    Determines if a word can legally be played on a vector on the scrabble
    board.

    Parameters:
    -----------
    word: string
    location
    start: (row, column) tuple
        Square on the board to place first letter of word.
    squares_to_erase: list of (row, column) tuples
        Empty squares on the board that were filled in by hypothetical moves.
        Will be erased when no longer needed.
    crossing_words: list of strings
        A list of words that the letter's containing word intersects with.

    Returns:
    --------
    True if the word can legally be played along the vector specified by
    location, starting at the start square, False otherwise.

    """
    word_can_fit = True
    word_ind = 0
    x = int(location[1:])
    for y in range(start, start+len(word)):
        if location[0] == 'r': # fit word horizontally
            square = (x, y)
            direction = ['horizontal']
        elif location[0] == 'c': # fit word vertically
            square = (y, x)
            direction = ['vertical']
        row, column = square
        if on_board(row, column) and not scrabble_board[row][column]:
            letter = word[word_ind]
            scrabble_board[row][column] = letter
            squares_to_erase.append(square)
            l_can_fit = letter_can_fit(letter, square, direction, crossing_words, squares_to_erase)
            if l_can_fit:
                word_ind += 1
                continue
            else:
                return False
        elif scrabble_board[row][column] == word[word_ind]:
            word_ind += 1
            continue
        else:
            word_can_fit = False
            return word_can_fit
    # make sure completed word is in the dictionary
    if location[0] == 'r':
        square = (x, y)
        direction = ['vertical']
    elif location[0] == 'c':
        square = (y, x)
        direction = ['horizontal']
    finished_word = find_words_including(square, directions=direction)
    if not word_in_dict(finished_word, dictionary):
        word_can_fit = False
    return word_can_fit

def location_and_score(word, location, square, start, crossing_words):
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
    word_score = score_word(word)
    for w in crossing_words:
        word_score += score_word(w)
    crossing_words[:] = []
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

def fit_word_around_letter(word, letter, index, location, start_locations):
    """
    Returns locations where word can be played around a letter in the vector
    specified by location.

    Parameters:
    -----------
    word: string
    letter: single-character string
    index: starting index in vector
    location: string
    start_locations: list of (row, column) 2-tuples
        List of squares where we have started to place the word along the
        vector specified by location.

    Returns:
    --------
    locations: list of dictionaries
        Each dictionary has the structure \{'location': (starting_square, ending_square),
                                            'score': word_score}
        Where starting_square and ending_square are the squares on which
        the first and last letters of the word are played.

    """
    locations = []
    vector = int(location[1:])
    if location[0] == 'r':
        square = (vector, index)
    elif location[0] == 'c':
        square = (index, vector)
    row, column = square
    crossing_words = []
    letter_ind_in_word = find_all_indices(letter, word) # where letter
                                    # occurs in word
    if not letter_ind_in_word:
        return locations
    for ind in letter_ind_in_word:
        start = index - ind
        if start in start_locations:
            continue
        else:
            start_locations.append(start)
        if start < 0 or (start + len(word) - 1) > BOARD_SIZE:
            continue
        squares_to_erase = []
        word_can_fit = can_fit(word, location, start, squares_to_erase, crossing_words)
        if word_can_fit:
            loc = location_and_score(word, location, square, start, crossing_words)
            locations.append(loc)
        erase_squares(squares_to_erase)
    return locations

def fit_word_in_empty_vector(word, location):
    """
    Returns locations where the word can be played in the empty vector
    specified by location.

    Parameters:
    -----------
    word: string
    location: string

    Returns:
    --------
    locations: list of dictionaries
        Each dictionary has the structure \{'location': (starting_square, ending_square),
                                            'score': word_score}
        Where starting_square and ending_square are the squares on which
        the first and last letters of the word are played.

    """
    vector = int(location[1:])
    locations = []
    for start in range(BOARD_SIZE-len(word)+1):
        if location[0] == 'r':
            square = (vector, start)
        elif location[0] == 'c':
            square = (start, vector)
        row, column = square
        crossing_words = []
        squares_to_erase = []
        word_can_fit = can_fit(word, location, start, squares_to_erase, crossing_words)
        if not crossing_words:
            erase_squares(squares_to_erase)
            continue
        if word_can_fit:
            loc = location_and_score(word, location, square, start, crossing_words)
            locations.append(loc)
        erase_squares(squares_to_erase)
    return locations

def find_possible_locations(word, location, letters_and_indices):
    """
    Finds all of the possible locations where a word can be played along
    the vector specified by location.

    Parameters:
    -----------
    word: string
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
    for letter, index in letters_and_indices:
        locations = fit_word_around_letter(word, letter, index, location, start_locations)
        r = []
        for loc in locations:
            score = loc['score']
            l = loc['location']
            result = {'word': word, 'score': score, 'location': l}
            r.append(result)
        possible_locations.extend(r)
    if not letters_and_indices:
        locations = fit_word_in_empty_vector(word, location)
        r = []
        for loc in locations:
            score = loc['score']
            l = loc['location']
            result = {'word': word, 'score': score, 'location': l}
            r.append(result)
        possible_locations.extend(r)
    return possible_locations

def fit_word(word, location):
    """
    Attempts to fit word into a location (particular row or column) on the
    scrabble_board, returns the word, and the squares in which its letters
    will be placed if it can fit, returns None otherwise

    Parameters:
    -----------
    word: string
        A dictionary word

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
    possible_locations = find_possible_locations(word, location, letters_and_indices)
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
    init_dictionary(WORD_FILE)
    # # unittest.main()
    scrabble_board[5][1] = 'M'
    occupied_squares.append((5, 1))
    scrabble_board[5][2] = 'A'
    occupied_squares.append((5, 2))
    scrabble_board[5][3] = 'N'
    occupied_squares.append((5, 3))
    scrabble_board[7][1] = 'M'
    occupied_squares.append((7, 1))
    scrabble_board[7][2] = 'A'
    occupied_squares.append((7, 2))
    scrabble_board[7][3] = 'N'
    occupied_squares.append((7, 3))
    print_scrabble_board(scrabble_board)
    words = find_playable_words(occupied_squares, list("NEUMANN"))
    for word in words:
        print word
    #print fit_word("CATASTROPHE", "c10")
    # scrabble_board[5][1] = 'M'
    # scrabble_board[5][3] = 'N'
    # scrabble_board[7][1] = 'M'
    # scrabble_board[7][3] = 'N'
    # print_scrabble_board(scrabble_board)
    # print fit_word("CATASTROPHE", "c13")
