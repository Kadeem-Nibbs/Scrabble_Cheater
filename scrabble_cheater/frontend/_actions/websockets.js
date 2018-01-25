import { 
  RECEIVED_SUGGESTED_WORDS,
  SENT_TABLE_DATA,
  RESET_SUGGESTED_WORDS
} from '../constants/actions'


// Used by rackWordlist thunk
export const resetSuggestedWords = () => ({
  type: RESET_SUGGESTED_WORDS
})

// Send
const sentTableData = () => ({
  type: SENT_TABLE_DATA
})

export const submitTableData = (socket) => {
  return (dispatch, getState) => {
    dispatch(sentTableData({ loading: true }))
    const tableData = {
      gameType: getState().gameType.gameType,
      board: getState().board.present.tiles,
      rack: getState().rack.present.letters
    }

    // Note: component socketIoHOC will receive the data and trigger receiveTableData
    socket.emit('analyze_board', JSON.stringify(tableData))
  }
}

// Receive 
export const receivedTableData = (suggestedWords) => ({
  type: RECEIVED_SUGGESTED_WORDS,
  suggestedWords
})
