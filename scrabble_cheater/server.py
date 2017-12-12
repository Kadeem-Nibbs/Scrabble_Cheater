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
    print game_data_json
    game_data = json.loads(game_data_json)
    print type(game_data)
    game_board = game_data['board']
    rack = game_data['rack']
    board = Board(game_board)
    wf = WordFinder(board, rack)
    emit('play', json.dumps(wf.find_highest_scoring_words()[:1000]))

if __name__ == "__main__":
    init_dictionary(WORD_FILE)
    init_trie()
    socketio.run(app, debug=True)
