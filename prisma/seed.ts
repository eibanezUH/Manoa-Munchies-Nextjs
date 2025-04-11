import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
}

const vendorMenus = [
  {
    // Holoholo grills
    vendorId: 1,
    items: [
      { name: 'Assorted Wraps', description: '', price: 6.89, category: 'Snack' },
      { name: 'Hot Taco Bar', description: '', price: 5.99, category: 'Snack' },
      { name: 'Turkey Avocado Bomb Panini', description: '', price: 4.56, category: 'Snack' },  
    ],
  },
  {
    // Panda Express
    vendorId: 2,
    items: [
      { name: 'Bowl', description: '', price: 10.20, category: 'Entree' },
      { name: 'Plate', description: '', price: 11.70, category: 'Entree' },
      { name: 'Bigger Plate', description: '', price: 13.20, category: 'Entree' },
    ],
  },
  
  {
    // L&L Hawaiian Barebecue
    vendorId: 3,
    items: [
      { name: 'Bbq Chicken', description: '', price: 11.25, category: 'Plate Lunch' },
      { name: 'Chicken Katsu', description: 'Crispy', price: 11.25, category: 'Plate Lunch' },
      { name: 'Fries', description: 'Crispy', price: 5.75, category: 'Side' },
    ],
  },
  {
    // Dunkin Dounts
      vendorId: 4,
      items: [
        { name: 'Hot Coffee', description: '', price: 7, category: 'Drinks' },
        { name: 'Iced Coffee', description: '', price: 7, category: 'Drinks' },
        { name: 'Blended Coffee', description: '', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Lasoon
      vendorId: ,
      items: [
        { name: 'Chicken Curry', description: '', price: 7, category: 'Plate Lunch' },
        { name: 'Daal(Lentils)', description: '', price: 7, category: 'Plate Lunch' },
        { name: 'Jackfruit Curry', description: '', price: 7, category: 'Plate Lunch' },
      ],
  },
  {
    // The Bean Counter
      vendorId: ,
      items: [
        { name: 'Brewed Coffee', description: '', price: 7, category: 'Drinks' },
        { name: 'Iced Coffee', description: '', price: 7, category: 'Drinks' },
        { name: 'Americano', description: '', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Ding Tea
      vendorId: ,
      items: [
        { name: 'Signature Milk Tea', description: '', price: 7, category: 'Drinks' },
        { name: 'Strawberry Yakult/Yogurt', description: '', price: 7, category: 'Drinks' },
        { name: 'Monster Bobo Latte', description: '', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Kooks Coffee
      vendorId: ,
      items: [
        { name: 'The Duke', description: 'Sea Salted Caramel with a Toasted Coconut White Cap (cold foam)', price: 7, category: 'Drinks' },
        { name: 'Gnarly Chai', description: 'Kook’s Dirty Chai', price: 7, category: 'Drinks' },
        { name: 'Party Wave', description: 'Ohia Lehua Honey & Cinnamon', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Starbucks
      vendorId: ,
      items: [
        { name: 'Strawberry Açaí Lemonade Refresher', description: 'Sweet strawberry, passionfruit, and açaí flavors balanced with the delightful zing of lemonade, served over ice with freeze-dried strawberry pieces', price: 7, category: 'Drinks' },
        { name: 'Caramel Ribbon Crunch Frappuccino  ', description: 'Buttery caramel syrup blended with coffee, milk and ice, then topped with a layer of dark caramel sauce, whipped cream, caramel drizzle and a crunchy caramel-sugar topping', price: 7, category: 'Drinks' },
        { name: 'Matcha Latte', description: ' handcrafted with our new unsweetened matcha, milk, and classic syrup', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Krazy Dogs
      vendorId: ,
      items: [
        { name: 'Classic Dog', description: 'with your choice of toppings: ketchup, mustard, mayo, relish, raw onions, sauerkraut, jalapeño, cheese', price: 7, category: 'Snack' },
        { name: 'Bacon Wrapped Dog', description: 'with your choice of toppings:   ketchup, mustard, mayo, relish, raw onions, sauerkraut, jalapeño, cheese', price: 7, category: 'Snack' },
        { name: 'Chili Cheese Dog', description: 'chili, raw onions, nacho cheese, shredded cheese', price: 7, category: 'Snack' },
      ],
  },
  {
    // Middle Eats
      vendorId: ,
      items: [
        { name: 'Falafel', description: '', price: 7, category: 'Vegan' },
        { name: 'Egyptian Koshary', description: '', price: 7, category: 'Vegan' },
        { name: 'Shawarma Brisket', description: '', price: 7, category: 'Meal' },
      ],
  },
  {
    // Olay's Thai Lao Express
      vendorId: ,
      items: [
        { name: 'Shrimp Summer Rolls', description: '', price: 7, category: 'Appetizers' },
        { name: 'Thai Curry Bowl', description: '', price: 7, category: 'Meal' },
        { name: 'Thai Coffee', description: '', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Saap Saap HI
      vendorId: ,
      items: [
        { name: 'Signature Lao Sausage Plate', description: '', price: 7, category: 'Plate Lunch' },
        { name: 'Lychee Dragon', description: '', price: 7, category: 'Drinks' },
        { name: 'Sweet Mango Sago', description: '', price: 7, category: 'Desserts' },
      ],
  },
  {
    // Veek Plant Based Burger
      vendorId: ,
      items: [
        { name: 'Veek Burger', description: 'Avocado, tomato, house BBQ sauce, chipotle aioli, and sprouts.', price: 7, category: 'Vegan' },
        { name: 'Melty Lava', description: 'Plant-based cheddar sauce, tomato, roasted onion, and mushrooms.', price: 7, category: 'Vegan' },
        { name: 'Veek Burger Deluxe', description: 'Veek burger + plant-based omelet, and greens.', price: 7, category: 'Vegan' },
      ],
  },
  {
    // Veggi Dogs
      vendorId: ,
      items: [
        { name: 'Reggi Dog', description: '', price: 7, category: 'Snacks' },
        { name: 'Surf Dog', description: '', price: 7, category: 'Snacks' },
        { name: 'Kimchee Dog', description: '', price: 7, category: 'Snacks' },
      ],
  },
  {
    // Walkng Tacos Hawaii
      vendorId: ,
      items: [
        { name: 'Signature Milk Tea', description: '', price: 7, category: 'Drinks' },
        { name: 'Strawberry Yakult/Yogurt', description: '', price: 7, category: 'Drinks' },
        { name: 'Monster Bobo Latte', description: '', price: 7, category: 'Drinks' },
      ],
  },
  {
    // BA-LE
      vendorId: ,
      items: [
        { name: 'Bbq Chicken Sandwhich', description: '', price: 7, category: 'Sandwhich' },
        { name: 'Lemon Grass Chicken Sandwhich', description: '', price: 7, category: 'Sandwhich' },
        { name: 'Combo Sandwhich', description: '', price: 7, category: 'Sandwhich' },
      ],
  },
  {
    // Hale Aloha Cafe
      vendorId: ,
      items: [
        { name: 'Pepperoni Pizza', description: '', price: 7, category: 'Pizza' },
        { name: 'Baked Potato', description: '', price: 7, category: 'Side' },
        { name: 'Tortilla Chips', description: '', price: 7, category: 'Snacks' },
      ],
  },
  {
    // Gateaway Cafe
      vendorId: ,
      items: [
        { name: 'Cheese Quesadilla', description: '', price: 7, category: 'Dinner' },
        { name: 'Herb Roasted Turkey Breast', description: '', price: 7, category: 'Lunch' },
        { name: 'Scramble Eggs', description: '', price: 7, category: 'Breakfeast' },
      ],
  },
];

for (const vendorData of vendorMenus) {
  for (const item of vendorData.items) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        vendorId: vendorData.vendorId,
      },
    });
  }
  console.log(`  Added ${vendorData.items.length} items for vendorId: ${vendorData.vendorId}`);
}
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
