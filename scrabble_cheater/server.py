from flask import Flask, request, render_template, redirect
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# @app.before_request
# def before_request():
#     pass
#
@app.route('/')
def index():
    return render_template("index.html")

@socketio.on('tableData')
def table_data(data):
    print 'received json:', json.loads(data)
    emit('tableData', 'Message received!!!')

if __name__ == "__main__":
    socketio.run(app)
