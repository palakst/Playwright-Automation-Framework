import { expect } from '@playwright/test'
import { test } from '../test-options'
import { faker } from '@faker-js/faker'
import { LoginPage } from '../pages/loginPage'

const multiple_items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Fleece Jacket']
const backpack = 'Sauce Labs Backpack'
const bikeLight = 'Sauce Labs Bike Light'
const usernames = {standard: "standard_user",empty:"", lockedOut: "locked_out_user",nonExisting: "not_existing_user"}
const passwords = {valid: "secret_sauce", empty: "",invalid: "invalid_data_passed"}

//test for empty username
test("Verify test for logging in with empty username", async ({ page }) => {
    await page.goto("/")
    const login_page = new LoginPage(page)
    await login_page.successLogin(usernames.empty, passwords.valid)
    expect(await login_page.errorMessage.textContent()).toBe("Epic sadface: Username is required")
  })
  //test for empty password
  test("Verify test for logging in with empty password", async ({ page }) => {
    await page.goto("/")
    const login_page = new LoginPage(page)
    await login_page.successLogin(usernames.standard, passwords.empty)
    expect(await login_page.errorMessage.textContent()).toBe("Epic sadface: Password is required")
  })
  
  //test for incorrect password
  test("Verify test for logging in with incorrect password", async ({ page }) => {
    await page.goto("/")
    const login_page = new LoginPage(page)
    await login_page.successLogin(usernames.standard, passwords.invalid)
    expect(await login_page.errorMessage.textContent()).toBe("Epic sadface: Username and password do not match any user in this service")
  })
  
  //test for wrong user
  test("Verify test for logging in with non existing user", async ({ page }) => {
    await page.goto("/")
    const login_page = new LoginPage(page)
    await login_page.successLogin(usernames.nonExisting, passwords.invalid)
    expect(await login_page.errorMessage.textContent()).toBe("Epic sadface: Username and password do not match any user in this service")
  })
  
  //test for logged out user
  test("Verify test for logging in with locked out password", async ({ page }) => {
    await page.goto("/")
    const login_page = new LoginPage(page)
    await login_page.successLogin(usernames.lockedOut, passwords.valid)
    expect(await login_page.errorMessage.textContent()).toBe("Epic sadface: Sorry, this user has been locked out.")
  })
  


// test for user is able to add an item to their cart
test("Test for adding an item to your cart", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack]);
    const cart_page = await home_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).toEqual([backpack])
})

// test for user is able to add multiple item to their cart
test("Test for adding multiple items to your cart", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart(multiple_items);
    const cart_page = await home_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining(multiple_items));
})

// test for user is able to remove an added item from cart
test("Test for removing items from your cart", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack, bikeLight]);
    await home_page.RemoveItemFromCart([backpack]);
    const cart_page = await home_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).not.toEqual(expect.arrayContaining([backpack]));
    expect(await cart_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([bikeLight]));
})

// test for user is able to navigate to item page for an item and the added button is present
test("Verify item added from home page is shown on item page", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack]);
    const item_page = await home_page.SelectItemAndGoToItemPage(backpack);
    expect(await item_page.itemName.textContent()).toEqual(backpack);
})

// test for user is able to navigate to item page for an item and add that item to the cart
test("Verify item added from item page", async ({ home_page }) => {
    const item_page = await home_page.SelectItemAndGoToItemPage(backpack);
    await item_page.waitForCustomSeconds(2);
    await item_page.addItemToCartFromItemPage();
    const cart_page = await item_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).toEqual([backpack]);
})

// test removing added item from the item page
test("Verify removing item from item page", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack]);
    const item_page = await home_page.SelectItemAndGoToItemPage(backpack);
    await item_page.removeItemToCartFromItemPage();
    const cart_page = await item_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).not.toEqual([backpack]);
})

// Sorting tests
test("Sort names ascending", async ({ home_page }) => {
    await home_page.sortTheItemsPresent('az');
    await home_page.validateSorting('az');
})

test("Sort names descending", async ({ home_page }) => {
    await home_page.sortTheItemsPresent('za');
    await home_page.validateSorting('za');
})

test("Sort cost ascending", async ({ home_page }) => {
    await home_page.sortTheItemsPresent('lohi');
    await home_page.validateSorting('lohi');
})

test("Sort cost descending", async ({ home_page }) => {
    await home_page.sortTheItemsPresent('hilo');
    await home_page.validateSorting('hilo');
})

// cart verification
test("View added items on cart page", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([bikeLight]);
    const cart_page = await home_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([bikeLight]));
})

// checkout navigation
test("Move to checkout page", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([bikeLight]);
    const cart_page = await home_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([bikeLight]));
    await cart_page.proceedToCheckOutPage();
})

test("Move to checkout and enter user details", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([bikeLight]);
    const cart_page = await home_page.goToCartPage();
    expect(await cart_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([bikeLight]));
    const check_out_page = await cart_page.proceedToCheckOutPage();
    await check_out_page.addUserDetailsInCheckOutPage(faker.person.firstName(), faker.person.lastName(), faker.location.zipCode());
    const check_out_final_page = await check_out_page.clickOnContinue();
    expect(check_out_final_page.page.url()).toBe('https://www.saucedemo.com/checkout-step-two.html');
    expect(await check_out_final_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([bikeLight]));
})

test("Finish transaction", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack, bikeLight])
    const cart_page = await home_page.goToCartPage()
    expect(await cart_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([backpack, bikeLight]))
    const check_out_page = await cart_page.proceedToCheckOutPage()
    await check_out_page.addUserDetailsInCheckOutPage(faker.person.firstName(), faker.person.lastName(), faker.location.zipCode())
    const check_out_final_page = await check_out_page.clickOnContinue()
    expect(check_out_final_page.page.url()).toBe('https://www.saucedemo.com/checkout-step-two.html');
    expect(await check_out_final_page.listItemsPresentOnCart()).toEqual(expect.arrayContaining([backpack, bikeLight]))
    const final_page = await check_out_final_page.finishTransaction()
    expect(await final_page.getHeaderText()).toBe('Thank you for your order!')
    await final_page.backHomeButton.click()
})

test("Do not allow checkout with empty cart", async ({ home_page }) => {
    const check_out_page = await home_page.goToCartPage()
    let proceeded = false
    try {
        await check_out_page.proceedToCheckOutPage()
        proceeded = true
    } catch (error) {
        console.log("Proceed to checkout blocked as expected:", error.message);
    }
    expect(proceeded).toBeFalsy()
})

test("Checkout behavior based on whether items are added", async ({ home_page }) => {
    const addItems = true;
    if (addItems) {
        await home_page.AddItemsWithNamesToCart([backpack, bikeLight])
    }
    const check_out_page = await home_page.goToCartPage()
    if (addItems) {
        await expect(check_out_page.proceedToCheckOutPage()).resolves.not.toThrow()
    } else {
        let proceeded = false
        try {
            await check_out_page.proceedToCheckOutPage()
            proceeded = true
        } catch (e) {
            console.log("Expected failure when no items added:", e.message)
        }
        expect(proceeded).toBeFalsy()
    }
})

test("Error message for empty first name", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack])
    const cart_page = await home_page.goToCartPage()
    const check_out_page = await cart_page.proceedToCheckOutPage()
    await check_out_page.addUserDetailsInCheckOutPage("", faker.person.lastName(), faker.location.zipCode())
    await check_out_page.clickOnContinue()
    expect(await check_out_page.getErrorMessage()).toBe("Error: First Name is required")
})

test("Error message for empty last name", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([bikeLight])
    const cart_page = await home_page.goToCartPage()
    const check_out_page = await cart_page.proceedToCheckOutPage()
    await check_out_page.addUserDetailsInCheckOutPage(faker.person.firstName(), "", faker.location.zipCode())
    await check_out_page.clickOnContinue()
    expect(await check_out_page.getErrorMessage()).toBe("Error: Last Name is required")
})

test("Error message for empty postcode", async ({ home_page }) => {
    await home_page.AddItemsWithNamesToCart([backpack, bikeLight])
    const cart_page = await home_page.goToCartPage()
    const check_out_page = await cart_page.proceedToCheckOutPage()
    await check_out_page.addUserDetailsInCheckOutPage(faker.person.firstName(), faker.person.lastName(), "")
    await check_out_page.clickOnContinue()
    expect(await check_out_page.getErrorMessage()).toBe("Error: Postal Code is required")
})

test("Verify item in cart remains same after user logs out and logs in again",async({home_page})=>{
    await home_page.AddItemsWithNamesToCart(multiple_items)
    const cart_page = await home_page.goToCartPage()
    expect(await cart_page.listItemsPresentOnCart()).toEqual(multiple_items)  
    const login_page = await cart_page.basePage.userLogoutsOfSite()
    const home_page_again = await login_page.successLogin("standard_user","secret_sauce")
    const cart_page_again = await home_page_again.goToCartPage()
    expect(await cart_page_again.listItemsPresentOnCart()).toEqual(multiple_items)    
})
