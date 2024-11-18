import React from 'react'
import { AppCheckbox } from './AppCheckbox'

describe('<AppCheckbox />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AppCheckbox />)
  })
})