import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor"

Given(/^an authorized user$/, function () {
  cy.visit("/")
})
When(/^navigating to homepage$/, () => {
  cy.get('[data-test="d2-am-Configuration-tab"]').should("be.visible")
})
When(/^I click on Push Analytics tab$/, () => {
  cy.get('[data-test="d2-am-Push Analytics-tab"]').should("be.visible").click()
})

Then(/^I should be able to access the Push Analytics$/, function () {
  cy.url().should("include", "/push-analytics")
})

When(/^I click the Add push analytics configuration button$/, () => {
  cy.get('[data-test="dhis2-uicore-button"]').click()
})
Then(/^I should be able to access the Visualization Groups menu$/, () => {
  cy.get('[data-test="Gateway-menu"]').should("be.visible")
  cy.get('[data-test="dhis2-uicore-button"]').should("be.visible")
})

When(/^I should be able to access the Send Push Analytics window$/, () => {})
Then(/^I should be able to access the Add group window$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I enter the Name for the push analytics$/, () => {
  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"]'
  )
    .should("be.visible")
    .type("Testing")
})

When(/^I select a gateway from the dropdown list on the Gateway field$/, () => {
  cy.get(
    ':nth-child(2) > [data-test="dhis2-uiwidgets-singleselectfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-singleselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
  )
    .click()
    .get('[data-value="ZGygzsbgifa"]')
    .click()
})

When(
  /^I select a visualization group from the dropdown list on the Visualization group field$/,
  () => {
    cy.get(
      ':nth-child(3) > [data-test="dhis2-uiwidgets-singleselectfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-singleselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
    )
      .click()
      .get('[data-test="dhis2-uicore-singleselectoption"]')
      .click()
  }
)

When(
  /^From the Visualization field I choose one or more visualizations that need to be sent to specific user, groups or phone number$/,
  () => {
    cy.get(
      '[data-test="dhis2-uicore-multiselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
    )
      .click()
      .get('[data-value="dR0AIXF98ds"] > [data-test="dhis2-uicore-checkbox"]')
      .click()
      .get('[data-value="V06KKMj8k8H"] > [data-test="dhis2-uicore-checkbox"]')
      .click()
  }
)

When(/^I enter the Description for the push analytics$/, () => {
  cy.get("#description").type("Testing Testing Testing", { force: true })
})

Then(
  /^I select atleast one recipients based on the user type either Group Type, User Type or Phone Number Type$/,
  () => {
    cy.get(
      '[style="display: grid; grid-template-columns: 2fr 3fr 1fr; gap: 16px; align-items: end;"] > [data-test="dhis2-uiwidgets-singleselectfield"] > [data-test="dhis2-uiwidgets-singleselectfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-singleselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
    )
      .click()
      .get('[data-value="individual"]')
      .click()
      .get(
        '[style="display: grid; grid-template-columns: 2fr 3fr 1fr; gap: 16px; align-items: end;"] > [data-test="dhis2-uiwidgets-inputfield"] > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
      )
      .type("255693134744", { force: true })
      .get(
        '[style="display: grid; grid-template-columns: 2fr 3fr 1fr; gap: 16px; align-items: end;"] > [data-test="dhis2-uicore-button"]'
      )
      .click({ force: true })
  }
)

When(/^I click the Save button$/, () => {
  cy.get('[data-test="dhis2-uicore-splitbutton-toggle"]')
    .should("be.visible")
    .click()
    .get(":nth-child(2) > a.jsx-2002348738 > .jsx-2002348738")
    .click()
})

Then(/^I should be  able to save the new push analytic$/, () => {})
Then(/^I should be able to get an alert bar$/, () => {
  cy.get('[data-test="dhis2-uicore-alertbar"]').should("be.visible")
})

When(/^I click on the three dots for actions$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-tablebody"] > :nth-child(1) > :nth-child(5) > button '
  ).click()
})

Then(/^I should be able to access the available actions$/, () => {
  cy.get('[data-test="dhis2-uicore-menu"]').should("be.visible")
})

When(/^I click on the Edit action$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-menu"] > [data-test="dhis2-uicore-menulist"] > :nth-child(1) '
  ).click()
})

Then(
  /^I should be able to edit the selected push analytics configuration$/,
  () => {
    cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
  }
)

When(/^I edit the name$/, () => {
  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  )
    .should("exist")
    .clear()
    .type("UpdatedName")

  cy.get(
    ':nth-child(1) > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
  ).should("have.value", "UpdatedName")
})

When(/^I change the Gateway selection$/, () => {})
When(/^I change the Visualization group selection$/, () => {
  cy.get(
    ':nth-child(3) > [data-test="dhis2-uiwidgets-singleselectfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-singleselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
  )
    .click()
    .get('[data-test="dhis2-uicore-singleselectoption"]')
    .click()
})
When(/^I change the selected visualizations selection$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-multiselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
  )
    .click()
    .get('[data-value="dR0AIXF98ds"] > [data-test="dhis2-uicore-checkbox"]')
    .click()
    .get('[data-value="V06KKMj8k8H"] > [data-test="dhis2-uicore-checkbox"]')
    .click()
    .get('[data-value="tS2gIIWVf6K"] > [data-test="dhis2-uicore-checkbox"]')
    .click()
    .get('[data-value="oWk64tUP5Dk"] > [data-test="dhis2-uicore-checkbox"]')
    .click()
})

When(/^I edit the description$/, () => {
  cy.get("#description").should("exist").clear().type("UpdatedTesting")

  cy.get("#description").should("have.value", "UpdatedTesting")
})

Then(/^I change the selected recipients$/, () => {
  cy.get(
    '.jsx-1346842267 > :nth-child(1) > [data-test="dhis2-uicore-chip-remove"]'
  ).click()
  cy.get(
    '[style="display: grid; grid-template-columns: 2fr 3fr 1fr; gap: 16px; align-items: end;"] > [data-test="dhis2-uiwidgets-singleselectfield"] > [data-test="dhis2-uiwidgets-singleselectfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-singleselect"] > .jsx-114080822 > [data-test="dhis2-uicore-select"] > [data-test="dhis2-uicore-select-input"]'
  )
    .click()
    .get('[data-value="individual"]')
    .click()
    .get(
      '[style="display: grid; grid-template-columns: 2fr 3fr 1fr; gap: 16px; align-items: end;"] > [data-test="dhis2-uiwidgets-inputfield"] > [data-test="dhis2-uiwidgets-inputfield-content"] > [data-test="dhis2-uicore-box"] > [data-test="dhis2-uicore-input"] > .jsx-3353877153'
    )
    .type("255693134744", { force: true })
    .get(
      '[style="display: grid; grid-template-columns: 2fr 3fr 1fr; gap: 16px; align-items: end;"] > [data-test="dhis2-uicore-button"]'
    )
    .click({ force: true })
})

When(/^I click on the update button$/, () => {
  cy.get('[data-test="dhis2-uicore-splitbutton-toggle"]')
    .click()
    .get(":nth-child(2) > a.jsx-2002348738 > .jsx-2002348738")
    .click()
})

When(/^I should be able to save the changes made$/, () => {})

When(/^I click on the Delete action$/, () => {
  cy.get(
    '[data-test="dhis2-uicore-menu"] > [data-test="dhis2-uicore-menulist"] > :nth-child(2)'
  ).click()
})

Then(/^I should get a pop up window to confirm deletion$/, () => {
  cy.get('[data-test="dhis2-uicore-card"]').should("be.visible")
})

When(/^I click on the Delete button$/, () => {
  cy.get(':nth-child(3) > [data-test="dhis2-uicore-button"]')
    .should("be.visible")
    .click()
})

Then(/^I should be able to delete the visualization group$/, () => {})
