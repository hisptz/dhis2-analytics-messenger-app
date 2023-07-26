import {Given, Then} from "@badeball/cypress-cucumber-preprocessor";


Given(/^an authorized user$/, function () {
    cy.visit("/");
});
Then(/^I should be able to access the app homepage$/, function () {
    cy.getWithDataTest("{Push Analytics-tab}").should("be.visible");
});
