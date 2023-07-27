Feature: Testing Setting Up Visual Group


  Scenario: Testing if login works
    Given an authorized user
    When navigating to homepage
    When  click on a tab
    Then I should be able to access the app homepage

