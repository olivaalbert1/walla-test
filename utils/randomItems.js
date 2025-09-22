// function that exports item name ramdomly in order to create data for tests

export function randomItemName() {
  const items = ['iPhone 8', 'iPhone X', 'iPhone 11', 'iPhone 12', 'iPhone 13', 'Samsung Galaxy S10', 'Samsung Galaxy S20', 'Samsung Galaxy S21', 'Google Pixel 4a', 'Google Pixel 5', 'OnePlus 8T', 'OnePlus 9', 'Xiaomi Mi 11', 'Xiaomi Redmi Note 10'];
  let itemName = items[Math.floor(Math.random() * items.length)];
  return itemName;
}