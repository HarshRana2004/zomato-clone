export const restaurants = [
  {
    id: 1,
    name: "Tandoori Flames",
    slug: "tandoori-flames",
    cuisine: "Indian",
    description: "Authentic North Indian cuisine",
    image: "https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg",
    rating: 4.5,
    distanceKm: 5,
    items: [
      // Starters
      { name: "Paneer Tikka", description: "Grilled paneer with spices", category: "Starters", price: 150,  image: "/menu-images/paneer-tikka.jpg", featured: true },
      { name: "Chicken Seekh Kebab", description: "Juicy minced chicken on skewers", category: "Starters", price: 180, image: "/menu-images/chicken-seekh-kebab.jpg" },
      { name: "Aloo Tikki", description: "Crispy potato patties with chutney", category: "Starters", price: 100, image: "/menu-images/aloo-tikki.jpg" },
      { name: "Hara Bhara Kabab", description: "Spinach and peas cutlets", category: "Starters", price: 120, image: "/menu-images/hara-bhara-kebab.jpg" },
      { name: "Tandoori Mushroom", description: "Mushrooms marinated in spices", category: "Starters", price: 140, image: "/menu-images/tandoori-mashroom.jpg" },

      // Main Course
      { name: "Butter Chicken", description: "Creamy buttery chicken", category: "Main Course", price: 240, image: "/menu-images/butter-chicken.jpg" },
      { name: "Paneer Butter Masala", description: "Paneer in rich tomato gravy", category: "Main Course", price: 220, image: "/menu-images/paneer-butter-masala.jpg" },
      { name: "Dal Makhani", description: "Black lentils in cream", category: "Main Course", price: 180, image: "/menu-images/dal-makhani.jpg" },
      { name: "Garlic Naan", description: "Soft naan with garlic butter", category: "Main Course", price: 60, image: "/menu-images/garlic-naan.jpg" },
      { name: "Jeera Rice", description: "Aromatic cumin-flavored rice", category: "Main Course", price: 90, image: "/menu-images/jeera-rice.jpg" },

      // Desserts
      { name: "Gulab Jamun", description: "Dough balls in syrup", category: "Desserts", price: 60, image: "/menu-images/gulab-jamun.jpg" },
      { name: "Rasmalai", description: "Cottage cheese in sweet milk", category: "Desserts", price: 80, image: "/menu-images/rasmalai.jpg" },
      { name: "Kheer", description: "Rice pudding with cardamom", category: "Desserts", price: 70, image: "/menu-images/kheer.jpg" },
      { name: "Jalebi", description: "Sweet and crispy coils", category: "Desserts", price: 65, image: "/menu-images/jalebi.jpg" },

      // Drinks
      { name: "Mango Lassi", description: "Sweet mango yogurt drink", category: "Drinks", price: 80, image: "/menu-images/mango-lassi.jpg" },
      { name: "Masala Chai", description: "Spiced Indian tea", category: "Drinks", price: 40, image: "/menu-images/masala-chai.jpg" },
      { name: "Sweet Lime Soda", description: "Refreshing soda", category: "Drinks", price: 50, image: "/menu-images/sweet-lime-soda.jpg" },
    ],
  },

  {
    id: 2,
    name: "Pizza Paradise",
    slug: "pizza-paradise",
    cuisine: "Italian",
    description: "Delicious pizzas with fresh ingredients",
    image: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
    rating: 4.2,
    distanceKm: 7,
    items: [
      // Starters
      { name: "Garlic Bread", description: "Crispy and buttery", category: "Starters", price: 99, featured: true, image: "/menu-images/garlic-bread.jpg" },
      { name: "Bruschetta", description: "Bread with tomato & basil", category: "Starters", price: 120, image: "/menu-images/bruschetta.jpg" },
      { name: "Cheesy Nachos", description: "Nachos with cheese & jalapeno", category: "Starters", price: 140, image: "/menu-images/cheesy-nachos.jpg" },
      { name: "Stuffed Mushrooms", description: "Cheese-stuffed baked mushrooms", category: "Starters", price: 135, image: "/menu-images/stuffed-mushrooms.jpg" },

      // Main Course
      { name: "Margherita Pizza", description: "Classic cheese pizza", category: "Main Course", price: 199, image: "/menu-images/margherita-pizza.jpg" },
      { name: "Farmhouse Pizza", description: "Veg loaded pizza", category: "Main Course", price: 249, image: "/menu-images/farmhouse-pizza.jpg" },
      { name: "Veggie Pasta", description: "Creamy white sauce pasta", category: "Main Course", price: 220, image: "/menu-images/veggie-pasta.jpg" },
      { name: "Chicken Lasagna", description: "Layered with chicken & cheese", category: "Main Course", price: 270, image: "/menu-images/chicken-lasagna.jpg" },
      { name: "Four Cheese Pizza", description: "Mozzarella, parmesan, cheddar, blue", category: "Main Course", price: 280, image: "/menu-images/four-cheese-pizza.jpg" },

      // Desserts
      { name: "Tiramisu", description: "Coffee-flavored layered dessert", category: "Desserts", price: 110, image: "/menu-images/tiramisu.jpg" },
      { name: "Chocolate Lava Cake", description: "Molten chocolate center", category: "Desserts", price: 120, image: "/menu-images/chocolate-lava-cake.jpg" },
      { name: "Gelato", description: "Italian-style ice cream", category: "Desserts", price: 100, image: "/menu-images/gelato.jpg" },

      // Drinks
      { name: "Coke", description: "Chilled soda", category: "Drinks", price: 50, image: "/menu-images/coke.jpg" },
      { name: "Lemon Iced Tea", description: "Cool and tangy", category: "Drinks", price: 60, image: "/menu-images/lemon-iced-tea.jpg" },
      { name: "Mint Mojito", description: "Fresh lime and mint drink", category: "Drinks", price: 75, image: "/menu-images/mint-mojito.jpg" },
    ],
  },

  {
    id: 3,
    name: "Sushi Zen",
    slug: "sushi-zen",
    cuisine: "Japanese",
    description: "Fresh and authentic Japanese sushi",
    image: "https://images.pexels.com/photos/26146816/pexels-photo-26146816.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.6,
    distanceKm: 6,
    items: [
      { name: "California Roll", description: "Crab, avocado, and cucumber", category: "Sushi", price: 250, image: "/menu-images/california-roll.jpg", featured: true },
      { name: "Spicy Tuna Roll", description: "Tuna with spicy mayo", category: "Sushi", price: 300, image: "/menu-images/spicy-tuna-roll.jpg" },
      { name: "Dragon Roll", description: "Eel, cucumber, avocado", category: "Sushi", price: 320, image: "/menu-images/dragon-roll.jpg" },
      { name: "Miso Soup", description: "Tofu and seaweed soup", category: "Soups", price: 100, image: "/menu-images/miso-soup.jpg" },
      { name: "Edamame", description: "Steamed soybeans", category: "Starters", price: 90, image: "/menu-images/edamame.jpg" },
      { name: "Tempura Prawns", description: "Crispy prawn fritters", category: "Starters", price: 160, image: "/menu-images/tempura-prawns.jpg" },
      { name: "Green Tea", description: "Authentic Japanese tea", category: "Drinks", price: 80, image: "/menu-images/green-tea.jpg" },
      { name: "Sake", description: "Japanese rice wine", category: "Drinks", price: 150, image: "/menu-images/sake.jpg" },
    ],
  },

  {
    id: 4,
    name: "Burger Haven",
    slug: "burger-haven",
    cuisine: "American",
    description: "Juicy burgers and crispy fries",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
    rating: 4.3,
    distanceKm: 4,
    items: [
      { name: "Classic Cheeseburger", description: "Beef patty with cheese", category: "Burgers", price: 199, image: "/menu-images/classic-cheeseburger.jpg", featured: true },
      { name: "Veggie Burger", description: "Grilled veggie patty", category: "Burgers", price: 180, image: "/menu-images/veggie-burger.jpg"},
      { name: "Double Bacon Burger", description: "Loaded with bacon & cheese", category: "Burgers", price: 250, image: "/menu-images/double-bacon-burger.jpg" },
      { name: "French Fries", description: "Crispy golden fries", category: "Sides", price: 80, image: "/menu-images/french-fries.jpg" },
      { name: "Onion Rings", description: "Battered and fried onion rings", category: "Sides", price: 85, image: "/menu-images/onion-rings.jpg" },
      { name: "Chocolate Milkshake", description: "Rich and creamy shake", category: "Drinks", price: 120, image: "/menu-images/chocolate-milkshake.jpg" },
      { name: "Strawberry Soda", description: "Fizzy strawberry drink", category: "Drinks", price: 75, image: "/menu-images/strawberry-soda.jpg" },
    ],
  },
];
