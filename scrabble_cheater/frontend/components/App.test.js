import React from 'react'
import App from './App'

test('render App', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).toMatchSnapshot()    
});
