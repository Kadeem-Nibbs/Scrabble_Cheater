import React from 'react'
import ReactDOM from 'react-dom'

import Board from './components/Board'

const Root = () => {
  return (
    <Board />
  )
}

ReactDOM.render(<Root />, document.querySelector('#root'))

// <script type="text/javascript" charset="utf-8">
//     var socket = io.connect('http://' + document.domain + ':' + location.port);
//     socket.on('connect', function() {
//         socket.emit('my event', {data: 'I\'m connected!'});
//     });
// </script>