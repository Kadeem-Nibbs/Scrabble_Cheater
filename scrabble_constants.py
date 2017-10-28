LETTER_VALUES = {'A': 1,
                 'B': 3,
                 'C': 3,
                 'D': 2,
                 'E': 1,
                 'F': 4,
                 'G': 2,
                 'H': 4,
                 'I': 1,
                 'J': 8,
                 'K': 5,
                 'L': 1,
                 'M': 3,
                 'N': 1,
                 'O': 1,
                 'P': 3,
                 'Q': 10,
                 'R': 1,
                 'S': 1,
                 'T': 1,
                 'U': 1,
                 'V': 4,
                 'W': 4,
                 'X': 8,
                 'Y': 4,
                 'Z': 10}

WWF_LET_VALUES = {'A': 1,
                 'B': 4,
                 'C': 4,
                 'D': 2,
                 'E': 1,
                 'F': 4,
                 'G': 3,
                 'H': 3,
                 'I': 1,
                 'J': 10,
                 'K': 5,
                 'L': 2,
                 'M': 4,
                 'N': 2,
                 'O': 1,
                 'P': 4,
                 'Q': 10,
                 'R': 1,
                 'S': 1,
                 'T': 1,
                 'U': 2,
                 'V': 5,
                 'W': 4,
                 'X': 8,
                 'Y': 3,
                 'Z': 10}

SCRABBLE_TILES = {'A': 9,
                 'B': 2,
                 'C': 2,
                 'D': 4,
                 'E': 12,
                 'F': 2,
                 'G': 3,
                 'H': 2,
                 'I': 9,
                 'J': 1,
                 'K': 1,
                 'L': 4,
                 'M': 2,
                 'N': 6,
                 'O': 8,
                 'P': 2,
                 'Q': 1,
                 'R': 6,
                 'S': 4,
                 'T': 6,
                 'U': 4,
                 'V': 2,
                 'W': 2,
                 'X': 1,
                 'Y': 2,
                 'Z': 1,
                 ' ': 2 }

BONUS_TILES = {(0, 0): "3W",
               (3, 0): "2L",
               (7, 0): "3W",
               (11, 0): "2L",
               (14, 0): "3W",
               (1, 1): "2W",
               (5, 1): "3L",
               (9, 1): "3L",
               (13, 1): "2W",
               (2, 2): "2W",
               (6, 2): "2L",
               (8, 2): "2L",
               (12, 2): "2W",
               (0, 3): "2L",
               (3, 3): "2W",
               (7, 3): "2L",
               (11, 3): "2W",
               (14, 3): "2L",
               (4, 4): "2W",
               (10, 4): "2L",
               (1, 5): "3L",
               (5, 5): "3L",
               (9, 5): "2L",
               (13, 5): "3L",
               (2, 6): "2L",
               (6, 6): "2L",
               (8, 6): "2L",
               (12, 6): "2L",
               (0, 7): "3W",
               (3, 7): "2L",
               (7, 7): "2W",
               (11, 7): "2L",
               (14, 7): "3W",
               (2, 8): "2L",
               (6, 8): "2L",
               (8, 8): "2L",
               (12, 8): "2L",
               (1, 9): "3L",
               (5, 9): "3L",
               (9, 9): "3L",
               (13, 9): "3L",
               (4, 10): "2W",
               (10, 10): "2W",
               (0, 11): "2L",
               (3, 11): "2W",
               (7, 11): "2L",
               (11, 11): "2W",
               (14, 11): "2L",
               (2, 12): "2W",
               (6, 12): "2L",
               (8, 12): "2L",
               (12, 12): "2W",
               (1, 13): "2W",
               (5, 13): "3L",
               (9, 13): "3L",
               (13, 13): "2W",
               (0, 14): "3W",
               (3, 14): "2L",
               (7, 14): "3W",
               (11, 14): "2L",
               (14, 14): "3W"
               }

WWF_BONUS_TILES = {(3, 0): "3W",
                   (6, 0): "3L",
                   (8, 0): "3L",
                   (11, 0): "3W",
                   (2, 1): "2L",
                   (5, 1): "2W",
                   (9, 1): "2W",
                   (12, 1): "2L",
                   (1, 2): "2L",
                   (4, 2): "2L",
                   (10, 2): "2L",
                   (13, 2): "2L",
                   (0, 3): "3W",
                   (3, 3): "3L",
                   (7, 3): "2W",
                   (11, 3): "3L",
                   (14, 3): "3W",
                   (2, 4): "2L",
                   (6, 4): "2L",
                   (8, 4): "2L",
                   (12, 4): "2L",
                   (1, 5): "2W",
                   (5, 5): "3L",
                   (9, 5): "3L",
                   (13, 5): "2W",
                   (0, 6): "3L",
                   (4, 6): "2L",
                   (10, 6): "2L",
                   (14, 6): "3L",
                   (3, 7): "2W",
                   (7, 7): "2W",
                   (11, 7): "2W",
                   (0, 8): "3L",
                   (4, 8): "2L",
                   (10, 8): "2L",
                   (14, 8): "3L",
                   (1, 9): "2W",
                   (5, 9): "3L",
                   (9, 9): "3L",
                   (13, 9): "2W",
                   (2, 10): "2L",
                   (6, 10): "2L",
                   (8, 10): "2L",
                   (12, 10): "2L",
                   (0, 11): "3W",
                   (3, 11): "3L",
                   (7, 11): "2W",
                   (11, 11): "3L",
                   (14, 11): "3W",
                   (1, 12): "2L",
                   (4, 12): "2L",
                   (10, 12): "2L",
                   (13, 12): "2L",
                   (2, 13): "2L",
                   (5, 13): "2W",
                   (9, 13): "2W",
                   (12, 13): "2L",
                   (3, 14): "3W",
                   (6, 14): "3L",
                   (8, 14): "3L",
                   (11, 14): "3W"}

BONUS_TILE_COLORS = {"2L": "cyan",
                     "3L": "blue",
                     "2W": "magenta",
                     "3W": "orange red",
                     None: "pale goldenrod"}
