import React from 'react'
import DesktopMenu from './DesktopMenu'

describe('<DesktopMenu />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DesktopMenu />)
  })
})