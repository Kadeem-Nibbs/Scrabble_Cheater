import React from 'react'
import HeaderRight from '../HeaderRight'

test('render HeaderRight', () => {
    const wrapper = shallow(<HeaderRight />)
    expect(wrapper).toMatchSnapshot()    
});
