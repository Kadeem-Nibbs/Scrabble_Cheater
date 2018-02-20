from flask import Flask, request, redirect

from flask_socketio import SocketIO, emit, send
from scrabble_cheater import Board, WordFinder, init_wwf_trie, init_scrabble_trie
from scrabble_cheater import WWF_WORD_FILE, SCRABBLE_WORD_FILE
from scrabble_cheater import wwf_trie, scrabble_trie, EMPTY_BOARD
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jfldaur3892309jlksf'
socketio = SocketIO(app)

board = Board(EMPTY_BOARD, 'wwf')
wf = WordFinder(board)

def configure_wordfinder(wf, board, game_type, rack):
    wf.update_board(board)
    wf.set_game(game_type)
    wf.load_rack(rack)

@socketio.on('connect')
def print_connected_status():
    print "Sockets Connected."

@socketio.on('analyze_board')
def display_highest_scoring_words(game_data_json):
    game_data = json.loads(game_data_json)
    game_board = game_data['board']
    game_type = game_data['gameType']

    rack = game_data['rack']
    board.set_game(game_type)
    board.read_board(game_board)
    configure_wordfinder(wf, board, game_type, rack)

    plays = json.dumps(wf.find_highest_scoring_words()[:100])
    emit('play', plays)

if __name__ == "__main__":
    init_wwf_trie(WWF_WORD_FILE)
    init_scrabble_trie(SCRABBLE_WORD_FILE)
    socketio.run(app, port=4000)
