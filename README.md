# Scrabble Cheater

Scrabble Cheater serves up an algorithm that calculates the best words you can play for to get the highest scores in Scrabble and Words With Friends. Here we have a Flask API connected to a React frontend via websockets.

## Installation

#### API:

Navigate to to `scrabble_cheater/` to install dependencies and run server: 
```
pip install -r requirements.txt`
python server.py
```

#### Frontend:
Need to have Praceljs installed globally:
```
npm install -g parcel-bundler
```

Navigate to `scrabble_cheater/frontend/` to install dependencies and run server:
```
npm run install
npm run dev
```

Run frontend tests: 

`npm run test`

If you make changes to existing components, update the components snapshot by running:
`npm run jest --updateSnapshot`
