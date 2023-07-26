import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor"

Given(/^an authorized user$/, function () {
  cy.visit("/")
})
When(/^navigating to homepage$/, () => {})
When(/^click on a tab$/, () => {})

Then(/^I should be able to access the app homepage$/, function () {
  cy.get('[data-test="dhis2-uicore-circularloader"]').should("be.visible")
})
