from flask import Flask, request, render_template, redirect

from flask_socketio import SocketIO, emit, send
from scrabble_cheater import Board, WordFinder, init_dictionary, init_trie, WORD_FILE, dictionary, trie

import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jfldaur3892309jlksf'
socketio = SocketIO(app)

# @app.before_request
# def before_request():
#     pass
#
@app.route('/')
def index():
    return render_template("index.html")

@socketio.on('analyze_board')
def display_highest_scoring_words(game_data_json):
    print "fn called"
    game_data = json.loads(game_data_json)
    print game_data
    rack = game_data['rack']
    game_board = game_data['board']
    board = Board(game_board)
    wf = WordFinder(board, rack)
    for play in wf.find_highest_scoring_words()[:50]:
        emit('play', json.dumps(play)+"\n")

if __name__ == "__main__":
    init_dictionary(WORD_FILE)
    init_trie()
    socketio.run(app, debug=True)
