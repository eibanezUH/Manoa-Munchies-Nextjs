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
      { name: 'Assorted Wraps', description: 'A fresh, flavorful wrap filled with a variety of meats, cheeses, and crisp vegetables, perfect for a quick and satisfying meal.', price: 6.89, category: 'Snack' },
      { name: 'Hot Taco Bar', description: 'Build-your-own hot taco bar with seasoned meats, fresh toppings, warm tortillas, and all your favorite fixings.', price: 5.99, category: 'Snack' },
      { name: 'Turkey Avocado Bomb Panini', description: 'Toasted panini loaded with sliced turkey, creamy avocado, melted cheese, and a flavor-packed spread—an explosive twist on a classic favorite.', price: 4.56, category: 'Snack' },  
    ],
  },
  {
    // Panda Express
    vendorId: 2,
    items: [
      { name: 'Bowl', description: '1 entree and 1 side', price: 10.20, category: 'Entree' },
      { name: 'Plate', description: '2 entree and 1 side', price: 11.70, category: 'Entree' },
      { name: 'Bigger Plate', description: '3 entree and 1 side', price: 13.20, category: 'Entree' },
    ],
  },
  
  {
    // L&L Hawaiian Barebecue
    vendorId: 3,
    items: [
      { name: 'Bbq Chicken', description: 'Tender grilled chicken glazed in smoky BBQ sauce—sweet, savory, and full of flavor.', price: 11.25, category: 'Plate Lunch' },
      { name: 'Chicken Katsu', description: 'Crispy breaded chicken cutlet, golden-fried and served with savory katsu sauce—a Japanese comfort food classic.', price: 11.25, category: 'Plate Lunch' },
      { name: 'Fries', description: 'Crispy golden fries, perfectly seasoned and fried to perfection—an all-time favorite side.', price: 5.75, category: 'Side' },
    ],
  },
  {
    // Dunkin Dounts
      vendorId: 4,
      items: [
        { name: 'Hot Coffee', description: 'Freshly brewed hot coffee, rich, bold, and perfect for a pick-me-up any time of day.', price: 7, category: 'Drinks' },
        { name: 'Iced Coffee', description: 'Freshly brewed hot coffee, rich, bold, and perfect for a pick-me-up any time of day.', price: 7, category: 'Drinks' },
        { name: 'Blended Coffee', description: 'Smooth and creamy blended coffee, a perfect mix of bold brew and icy indulgence.', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Lasoon
      vendorId: ,
      items: [
        { name: 'Chicken Curry', description: 'Savory chicken simmered in a rich, spiced curry sauce—comforting, flavorful, and served hot.', price: 7, category: 'Plate Lunch' },
        { name: 'Daal(Lentils)', description: 'Hearty and flavorful lentils cooked in aromatic spices, creating a comforting and nutritious daal dish.', price: 7, category: 'Plate Lunch' },
        { name: 'Jackfruit Curry', description: 'Tender jackfruit cooked in a rich, spiced curry sauce—an aromatic, plant-based dish full of flavor and texture.', price: 7, category: 'Plate Lunch' },
      ],
  },
  {
    // The Bean Counter
      vendorId: ,
      items: [
        { name: 'Brewed Coffee', description: 'Rich and aromatic brewed coffee, made from freshly ground beans for a smooth and satisfying cup.', price: 7, category: 'Drinks' },
        { name: 'Iced Coffee', description: 'Chilled, refreshing iced coffee, brewed to perfection and served over ice for a cool, energizing treat.', price: 7, category: 'Drinks' },
        { name: 'Americano', description: 'A bold, smooth espresso diluted with hot water for a rich yet mellow flavor—perfect for coffee purists.', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Ding Tea
      vendorId: ,
      items: [
        { name: 'Signature Milk Tea', description: 'A creamy blend of strong tea and velvety milk, perfectly balanced and sweetened for a smooth, signature drink.', price: 7, category: 'Drinks' },
        { name: 'Strawberry Yakult/Yogurt', description: 'A refreshing blend of tangy yogurt or Yakult with sweet, juicy strawberries—smooth, creamy, and packed with probiotics.', price: 7, category: 'Drinks' },
        { name: 'Monster Bobo Latte', description: 'A bold, energizing blend of Monster energy drink and creamy milk, topped with chewy boba pearls for a unique, refreshing twist.', price: 7, category: 'Drinks' },
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
        { name: 'Falafel', description: 'Crispy, golden-brown falafel made from ground chickpeas and aromatic herbs, served with a side of creamy tahini or yogurt sauce.', price: 7, category: 'Vegan' },
        { name: 'Egyptian Koshary', description: 'A hearty Egyptian dish featuring a flavorful mix of rice, lentils, pasta, and crispy onions, topped with a tangy tomato sauce and garlic vinegar.', price: 7, category: 'Vegan' },
        { name: 'Shawarma Brisket', description: 'Tender, slow-cooked brisket seasoned with savory shawarma spices, served with fresh veggies and creamy sauce in a warm pita or flatbread.', price: 7, category: 'Meal' },
      ],
  },
  {
    // Olay's Thai Lao Express
      vendorId: ,
      items: [
        { name: 'Shrimp Summer Rolls', description: 'Fresh and light shrimp summer rolls filled with tender shrimp, crisp veggies, and herbs, wrapped in translucent rice paper, served with a tangy peanut or hoisin dipping sauce.', price: 7, category: 'Appetizers' },
        { name: 'Thai Curry Bowl', description: 'A fragrant, creamy Thai curry bowl with tender vegetables and your choice of protein, simmered in a rich coconut milk sauce with bold herbs and spices.', price: 7, category: 'Meal' },
        { name: 'Thai Coffee', description: 'Rich and bold Thai coffee, brewed strong and sweetened with condensed milk, offering a smooth, aromatic taste with a touch of indulgence.', price: 7, category: 'Drinks' },
      ],
  },
  {
    // Saap Saap HI
      vendorId: ,
      items: [
        { name: 'Signature Lao Sausage Plate', description: 'A flavorful plate featuring juicy, herbed Lao sausage, grilled to perfection and served with fresh herbs, sticky rice, and a tangy dipping sauce.', price: 7, category: 'Plate Lunch' },
        { name: 'Lychee Dragon', description: 'A tropical blend of sweet lychee and vibrant dragon fruit, creating a refreshing, exotic drink with a burst of fruity flavor.', price: 7, category: 'Drinks' },
        { name: 'Sweet Mango Sago', description: 'A creamy and refreshing dessert made with sweet mango puree, chewy sago pearls, and a hint of coconut milk for a tropical treat.', price: 7, category: 'Desserts' },
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
        { name: 'Reggi Dog', description: 'A fun, flavorful twist on the classic hot dog, featuring a grilled sausage topped with tangy sauces, crispy toppings, and a signature kick.', price: 7, category: 'Snacks' },
        { name: 'Surf Dog', description: 'A delicious hot dog topped with grilled shrimp or seafood, drizzled with a zesty sauce, and finished with fresh veggies for a coastal-inspired twist.', price: 7, category: 'Snacks' },
        { name: 'Kimchee Dog', description: 'A bold and flavorful hot dog topped with spicy, tangy kimchi, adding a perfect balance of heat and crunch to every bite.', price: 7, category: 'Snacks' },
      ],
  },
  {
    // Walkng Tacos Hawaii
      vendorId: ,
      items: [
        { name: 'The Big Hawaiian', description: 'Three seasoned scrambled eggs, span, bacon, sausage, hashbrowns, salsa, red onion, jalapeno, shredded cheese, cilantro, and siracha mayo in a double classic flour tortilla.', price: 7, category: '' },
        { name: 'The Eggy and Cheesy', description: 'Three seasoned scrambled eggs, shredded cheese, white queso cheese sauce, and cilantro in a classic flour tortilla.', price: 7, category: '' },
        { name: 'Mean Green Protein', description: 'Three seasoned scrambled eggs, beans, diced tomatoes, shredded cheese, and salsa in a spinach infused flour tortilla.', price: 7, category: '' },
      ],
  },
  {
    // BA-LE
      vendorId: ,
      items: [
        { name: 'Bbq Chicken Sandwhich', description: 'Tender, grilled chicken glazed with smoky BBQ sauce, served on a toasted bun with crisp lettuce and tangy pickles for a perfect bite.', price: 7, category: 'Sandwhich' },
        { name: 'Lemon Grass Chicken Sandwhich', description: '"Grilled chicken marinated in fragrant lemongrass, served on a soft bun with fresh veggies and a zesty sauce for a refreshing and flavorful sandwich.', price: 7, category: 'Sandwhich' },
        { name: 'Combo Sandwhich', description: 'A hearty combo sandwich featuring a delicious mix of meats, cheese, fresh veggies, and a tangy sauce, all stacked between soft, toasted bread.', price: 7, category: 'Sandwhich' },
      ],
  },
  {
    // Hale Aloha Cafe
      vendorId: ,
      items: [
        { name: 'Pepperoni Pizza', description: 'A classic pepperoni pizza with a crispy crust, topped with rich tomato sauce, melted mozzarella, and plenty of savory pepperoni slices.', price: 7, category: 'Pizza' },
        { name: 'Baked Potato', description: 'A perfectly baked potato with a fluffy interior, served with your choice of toppings like sour cream, cheese, chives, and crispy bacon.', price: 7, category: 'Side' },
        { name: 'Tortilla Chips', description: 'Crispy, golden tortilla chips, perfect for dipping in salsa, guacamole, or queso—an irresistible snack.', price: 7, category: 'Snacks' },
      ],
  },
  {
    // Gateaway Cafe
      vendorId: ,
      items: [
        { name: 'Cheese Quesadilla', description: 'A warm, melted cheese quesadilla, with gooey cheese sandwiched between two crispy flour tortillas—simple, savory, and satisfying', price: 7, category: 'Dinner' },
        { name: 'Herb Roasted Turkey Breast', description: 'Tender, herb-roasted turkey breast, perfectly seasoned with aromatic herbs and roasted to juicy perfection.', price: 7, category: 'Lunch' },
        { name: 'Scramble Eggs', description: 'Fluffy, creamy scrambled eggs, cooked to perfection for a simple and satisfying breakfast.', price: 7, category: 'Breakfeast' },
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
