Feature: Topbar component

  Scenario: Display Topbar with user information, search input, and action buttons
    Given I am on the homepage
    Then I should see "InMa" in the topbar
    And I should see the "Username" displayed in the topbar
    And I should see a search input with the placeholder "Search"
    And I should see a notification icon in the topbar
    And I should see a settings icon in the topbar
    And I should see a button labeled "Create Invoice"
