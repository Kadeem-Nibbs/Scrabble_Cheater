import React from 'react'
import HeaderLeft from '../HeaderLeft'

test('render HeaderLeft', () => {
    const wrapper = shallow(<HeaderLeft />)
    expect(wrapper).toMatchSnapshot()    
});
