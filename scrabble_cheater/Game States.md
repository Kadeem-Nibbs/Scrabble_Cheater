
Game States: 
  Message to server format: 
    {
      rack: 
        'asddffg',
      gameType: 'scrabble' OR 'wordsWithFriends',
      board: 
        [[None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, u'F', None, None, None, None, None, None, None, None], [None, None, None, None, None, None, u'F', None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None], [None, None, None, None, None, None, None, None, None, None, None, None, None, None, None]]
    }

  Message to client format:
    Blank tile = 'C*'
    Existing tile = 'C$'
    
    Example: 
      ('MIMICKED', ((3, 5), (3, 12)), ('M', 'I', 'M*', 'I', 'C$', 'K', 'E', 'D'), 75) )
      ('MIMICKED', ((3, 5), (3, 12)), ('_', 'I', 'M', 'I', 'C$', 'K', 'E', 'D'), 75) )
      ('MISLIKED', ((5, 6), (5, 13)), ('M', 'I', 'S*', 'L$', I', 'K', 'E', 'D'), 67) )

