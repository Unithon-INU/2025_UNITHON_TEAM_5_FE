import React from 'react'
import styled from 'styled-components'

const ToggleSwitch = ({ selected, setSelected }) => {
  return (
    <Wrapper>
      <Slider active={selected} />
      <Tab
        active={selected === 'emergency'}
        onClick={() => setSelected('emergency')}
      >
        emergency
      </Tab>
      <Tab
        active={selected === 'hospital'}
        onClick={() => setSelected('hospital')}
      >
        hospital
      </Tab>
    </Wrapper>
  )
}

export default ToggleSwitch

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 160px;
  height: 34px;
  background-color: #3A78EB;
  border-radius: 17px;
  box-sizing: border-box;
`

const Tab = styled.button`
  flex: 1;
  z-index: 1;
  border: none;
  border-radius: 17px;
  background: transparent;
  color: ${({ active }) => (active ? '#000' : '#fff')};
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
`

const Slider = styled.div`
  position: absolute;
  left: ${({ active }) => (active === 'emergency' ? '0px' : 'calc(50% + 2px)')};
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-radius: 17px;
  transition: left 0.3s ease;
  z-index: 0;
`
