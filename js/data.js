/* ==========================================================================
   FreshMart Grocery eCommerce - Initial Data & Dynamic Data Accessors
   ========================================================================== */

const INITIAL_CATEGORIES = [
    { id: 'rice', name: 'Rice', icon: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&q=80', description: 'Premium Basmati, Miniket, & Aromatic Rice', count: '48 items', status: 'active' },
    { id: 'chocolate', name: 'Chocolate', icon: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=150&q=80', description: 'Swiss Chocolates, Dark Cocoa & Truffles', count: '35 items', status: 'active' },
    { id: 'frozen', name: 'Frozen Items', icon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80', description: 'Frozen Peas, Nuggets, Fries & Ready Meals', count: '62 items', status: 'active' },
    { id: 'meat', name: 'Meat', icon: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=150&q=80', description: 'Fresh Mutton, Premium Beef & Tender Ribs', count: '28 items', status: 'active' },
    { id: 'chicken', name: 'Chicken', icon: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=150&q=80', description: 'Farm Fresh Whole Chicken & Cut Parts', count: '32 items', status: 'active' },
    { id: 'fish', name: 'Fish', icon: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=150&q=80', description: 'Freshwater Fish, Salmon & Sea Prawns', count: '41 items', status: 'active' },
    { id: 'vegetables', name: 'Vegetables', icon: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=150&q=80', description: 'Organic Farm Fresh Leafy & Root Veggies', count: '124 items', status: 'active' },
    { id: 'fruits', name: 'Fruits', icon: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=150&q=80', description: 'Juicy Apples, Berries, Mangoes & Citrus', count: '86 items', status: 'active' },
    { id: 'snacks', name: 'Snacks', icon: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=150&q=80', description: 'Crispy Potato Chips, Nuts & Biscuits', count: '95 items', status: 'active' },
    { id: 'beverages', name: 'Beverages', icon: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=150&q=80', description: 'Natural Juices, Carbonated Soft Drinks & Teas', count: '74 items', status: 'active' },
    { id: 'dairy', name: 'Dairy', icon: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=150&q=80', description: 'Fresh Whole Milk, Butter, Cheese & Yogurt', count: '53 items', status: 'active' },
    { id: 'cooking-essentials', name: 'Cooking Essentials', icon: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&q=80', description: 'Pure Mustard Oil, Sunflower Oil, Salt & Flour', count: '68 items', status: 'active' },
    { id: 'spices', name: 'Spices', icon: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=150&q=80', description: 'Turmeric Powder, Cumin, Chili & Cardamom', count: '59 items', status: 'active' },
    { id: 'personal-care', name: 'Personal Care', icon: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&q=80', description: 'Soaps, Shampoos, Handwash & Skincare', count: '110 items', status: 'active' },
    { id: 'household', name: 'Household Items', icon: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&q=80', description: 'Detergents, Surface Cleaners & Paper Towels', count: '82 items', status: 'active' }
];

const INITIAL_BANNERS = [
    {
        id: 'banner-01',
        tag: 'Fresh Organic Produce',
        title: 'Fresh From Farm.<br/>Delivered To Your Door.',
        subtitle: 'Organic fruits & vegetables, harvested fresh and delivered daily.',
        buttonText: 'Shop Fresh Produce',
        link: 'pages/categories/vegetables/index.html',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80',
        status: 'active',
        order: 1
    },
    {
        id: 'banner-02',
        tag: 'Premium Cuts',
        title: '100% Halal Fresh Mutton & Beef',
        subtitle: 'Hygienically hand-cut, vacuum sealed, and delivered in cold-pack insulation.',
        buttonText: 'Order Meat & Seafood',
        link: 'pages/categories/meat/index.html',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1600&q=80',
        status: 'active',
        order: 2
    },
    {
        id: 'banner-03',
        tag: 'Pantry Essentials',
        title: 'Aged Basmati Rice & Pure Oils',
        subtitle: 'Stock up your pantry with authentic ingredients at unbeatable wholesale prices.',
        buttonText: 'Browse Pantry Staples',
        link: 'pages/categories/rice/index.html',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&q=80',
        status: 'active',
        order: 3
    }
];

const INITIAL_SETTINGS = {
    siteName: 'FreshMart',
    tagline: 'Modern & Premium Online Grocery Marketplace',
    currencySymbol: '৳',
    freeDeliveryThreshold: 1000,
    deliveryFee: 60,
    phone: '+1 (800) 555-FRESH',
    whatsapp: '+1 (800) 555-9999',
    email: 'support@freshmart.com',
    address: '124 Fresh Harvest Avenue, Metro Green Zone',
    businessHours: '7:00 AM - 11:00 PM (Everyday)',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    adminPassword: 'admin123'
};

const INITIAL_CUSTOMERS = [
    { id: 'cust-101', name: 'Ahsan Habib', email: 'ahsan@example.com', phone: '+8801711223344', address: 'House 12, Road 5, Dhanmondi, Dhaka', totalOrders: 5, totalSpent: 7850, lastOrderDate: 'Sep 12, 2026' },
    { id: 'cust-102', name: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '+8801822334455', address: 'Plot 4, Gulshan 2, Dhaka', totalOrders: 3, totalSpent: 4200, lastOrderDate: 'Sep 10, 2026' }
];

const INITIAL_PRODUCTS = [
    // --- RICE ---
    {
        id: 'rice-01',
        name: 'Royal India Premium Long Grain Basmati Rice',
        brand: 'Royal India',
        category: 'rice',
        categoryName: 'Rice',
        price: 1450.00,
        originalPrice: 1800.00,
        discount: 19,
        rating: 4.9,
        reviewCount: 238,
        stock: 45,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1 kg', priceMultiplier: 1 },
            { label: '2 kg', priceMultiplier: 1.9 },
            { label: '5 kg', priceMultiplier: 4.5 }
        ],
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
        thumbnails: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
            'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80'
        ],
        shortDescription: 'Aromatic, aged extra-long grain basmati rice perfect for biryani and pilaf.',
        description: 'Harvested from the foothills of the Himalayas, Royal India Aged Basmati Rice is aged for 2 years to achieve maximum aroma, fluffy non-sticky texture, and delicate nutty flavor.',
        ingredients: '100% Pure Aged Basmati Rice',
        origin: 'India',
        storage: 'Store in a cool, dry place inside an airtight container.',
        expiry: '24 Months from packaging date'
    },
    {
        id: 'rice-02',
        name: 'Organic Jasmine Fragrant Rice',
        brand: 'NatureFresh',
        category: 'rice',
        categoryName: 'Rice',
        price: 980.00,
        originalPrice: 1200.00,
        discount: 18,
        rating: 4.7,
        reviewCount: 95,
        stock: 30,
        inStock: true,
        isFeatured: false,
        status: 'active',
        weightVariants: [
            { label: '1 kg', priceMultiplier: 1 },
            { label: '2.5 kg', priceMultiplier: 2.3 }
        ],
        image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80'],
        shortDescription: 'Naturally fragrant Thai Jasmine rice with subtle sweet aroma.',
        description: 'Authentic Thai Hom Mali Jasmine Rice. Soft, slightly sticky texture when cooked, ideal for stir-fries, curries, and fried rice dishes.',
        ingredients: '100% Organic Jasmine Rice',
        origin: 'Thailand',
        storage: 'Keep away from direct sunlight.',
        expiry: '18 Months'
    },
    {
        id: 'rice-03',
        name: 'Premium Miniket Boiled Rice',
        brand: 'FreshHarvest',
        category: 'rice',
        categoryName: 'Rice',
        price: 380.00,
        originalPrice: 450.00,
        discount: 15,
        rating: 4.6,
        reviewCount: 160,
        stock: 80,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '5 kg', priceMultiplier: 1 },
            { label: '10 kg', priceMultiplier: 1.95 }
        ],
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80'],
        shortDescription: 'Slender staple white rice, high nutritional retention.',
        description: 'Cleaned and double polished Miniket rice, light on stomach, suitable for daily family meals.',
        ingredients: 'Parboiled Miniket Rice',
        origin: 'Bangladesh',
        storage: 'Dry ambient storage.',
        expiry: '12 Months'
    },

    // --- CHOCOLATE ---
    {
        id: 'choc-01',
        name: 'Lindt Excellence 85% Cocoa Dark Chocolate',
        brand: 'Lindt',
        category: 'chocolate',
        categoryName: 'Chocolate',
        price: 490.00,
        originalPrice: 620.00,
        discount: 20,
        rating: 4.9,
        reviewCount: 312,
        stock: 50,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '100g Bar', priceMultiplier: 1 },
            { label: 'Pack of 3', priceMultiplier: 2.8 }
        ],
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&q=80'],
        shortDescription: 'Rich, intense dark chocolate crafted by Swiss master chocolatiers.',
        description: 'Lindt Excellence 85% Cocoa Dark Chocolate bar reveals full-bodied cocoa flavors with balanced bitterness and velvety smooth melt.',
        ingredients: 'Chocolate, Cocoa Powder, Cocoa Butter, Demerara Sugar, Vanilla',
        origin: 'Switzerland',
        storage: 'Store between 14°C and 18°C.',
        expiry: '12 Months'
    },
    {
        id: 'choc-02',
        name: 'Ferrero Rocher Fine Hazelnut Chocolates',
        brand: 'Ferrero',
        category: 'chocolate',
        categoryName: 'Chocolate',
        price: 1150.00,
        originalPrice: 1400.00,
        discount: 18,
        rating: 4.9,
        reviewCount: 420,
        stock: 25,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '16 Pcs Box', priceMultiplier: 1 },
            { label: '24 Pcs Gift Box', priceMultiplier: 1.45 }
        ],
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80'],
        shortDescription: 'Whole crunchy hazelnut wrapped in creamy chocolate milk filling.',
        description: 'Iconic golden wrapped chocolates with crisp wafer shell, milk chocolate coating and roasted hazelnut pieces.',
        ingredients: 'Milk Chocolate, Hazelnuts, Sugar, Palm Oil, Wheat Flour, Cocoa',
        origin: 'Italy',
        storage: 'Keep cool and dry.',
        expiry: '9 Months'
    },

    // --- FROZEN ITEMS ---
    {
        id: 'froz-01',
        name: 'MCCAIN Crisp Golden Potato French Fries',
        brand: 'McCain',
        category: 'frozen',
        categoryName: 'Frozen Items',
        price: 540.00,
        originalPrice: 650.00,
        discount: 17,
        rating: 4.8,
        reviewCount: 184,
        stock: 40,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '750g', priceMultiplier: 1 },
            { label: '1.2 kg', priceMultiplier: 1.5 }
        ],
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&q=80'],
        shortDescription: 'Crispy exterior, fluffy interior straight cut frozen fries.',
        description: 'Air-fry or deep fry in minutes for restaurant quality golden french fries.',
        ingredients: 'Potatoes, Vegetable Oil (Sunflower), Salt',
        origin: 'Canada',
        storage: 'Keep frozen at -18°C.',
        expiry: '18 Months'
    },

    // --- MEAT ---
    {
        id: 'meat-01',
        name: 'Fresh Prime Bone-In Mutton Cut',
        brand: 'FreshMeat Co.',
        category: 'meat',
        categoryName: 'Meat',
        price: 1850.00,
        originalPrice: 2200.00,
        discount: 16,
        rating: 4.9,
        reviewCount: 290,
        stock: 20,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1 kg', priceMultiplier: 1 },
            { label: '2 kg', priceMultiplier: 1.95 }
        ],
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80'],
        shortDescription: '100% Halal fresh grass-fed mutton curry cut.',
        description: 'Hand-selected tender goat mutton, hygienically processed and vacuum sealed for maximum freshness.',
        ingredients: 'Fresh Mutton Meat',
        origin: 'Local Organic Farms',
        storage: 'Refrigerate immediately (0°C to 4°C). Consume within 48h or freeze.',
        expiry: 'Fresh (48 hrs)'
    },

    // --- CHICKEN ---
    {
        id: 'chick-01',
        name: 'Organic Farm Fresh Whole Broiler Chicken',
        brand: 'Green Poultry',
        category: 'chicken',
        categoryName: 'Chicken',
        price: 280.00,
        originalPrice: 350.00,
        discount: 15,
        rating: 4.8,
        reviewCount: 310,
        stock: 50,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1.2 kg (Whole Cleaned)', priceMultiplier: 1 },
            { label: 'Curry Cut (12 Pcs)', priceMultiplier: 1.1 }
        ],
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80'],
        shortDescription: 'Antibiotic-free naturally raised farm whole chicken.',
        description: 'Dressed and skinless farm broiler chicken. Washed and vacuum packed.',
        ingredients: 'Whole Broiler Chicken',
        origin: 'Local Organic Poultry Farm',
        storage: 'Keep chilled below 4°C.',
        expiry: '3 Days chilled'
    },

    // --- FISH ---
    {
        id: 'fish-01',
        name: 'Fresh Norwegian Salmon Steak Cuts',
        brand: 'Ocean Catch',
        category: 'fish',
        categoryName: 'Fish',
        price: 2400.00,
        originalPrice: 2900.00,
        discount: 17,
        rating: 5.0,
        reviewCount: 140,
        stock: 15,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '500g (2 Steaks)', priceMultiplier: 1 },
            { label: '1 kg (4 Steaks)', priceMultiplier: 1.95 }
        ],
        image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&q=80'],
        shortDescription: 'Air-flown fresh Atlantic Salmon rich in Omega-3 fatty acids.',
        description: 'Vibrant pink skin-on salmon steaks, rich in flavor and healthy fats.',
        ingredients: 'Fresh Atlantic Salmon',
        origin: 'Norway',
        storage: 'Keep on ice or refrigerate below 2°C.',
        expiry: '48 Hours'
    },

    // --- VEGETABLES ---
    {
        id: 'veg-01',
        name: 'Fresh Organic Farm Tomatoes',
        brand: 'GreenEarth',
        category: 'vegetables',
        categoryName: 'Vegetables',
        price: 90.00,
        originalPrice: 120.00,
        discount: 21,
        rating: 4.7,
        reviewCount: 450,
        stock: 100,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1 kg', priceMultiplier: 1 },
            { label: '2 kg', priceMultiplier: 1.9 }
        ],
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80'],
        shortDescription: 'Ripe red vine tomatoes grown without chemical pesticides.',
        description: 'Juicy, naturally sweet tomatoes harvested daily from hydroponic farms.',
        ingredients: '100% Fresh Tomatoes',
        origin: 'Local Hydroponic Farm',
        storage: 'Store at room temperature until ripe, then chill.',
        expiry: '7 Days'
    },
    {
        id: 'veg-02',
        name: 'Fresh Crisp Broccoli Heads',
        brand: 'GreenEarth',
        category: 'vegetables',
        categoryName: 'Vegetables',
        price: 130.00,
        originalPrice: 160.00,
        discount: 22,
        rating: 4.8,
        reviewCount: 165,
        stock: 45,
        inStock: true,
        isFeatured: false,
        status: 'active',
        weightVariants: [
            { label: '500g Head', priceMultiplier: 1 },
            { label: '1 kg (2 Heads)', priceMultiplier: 1.85 }
        ],
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80'],
        shortDescription: 'Vibrant green nutrient-dense broccoli florets.',
        description: 'High in Fiber and Vitamin C. Excellent for steaming and stir frying.',
        ingredients: 'Broccoli',
        origin: 'Highland Farms',
        storage: 'Refrigerate in perforated plastic bag.',
        expiry: '5 Days'
    },

    // --- FRUITS ---
    {
        id: 'fruit-01',
        name: 'Crisp Royal Gala Red Apples',
        brand: 'Orchard Fresh',
        category: 'fruits',
        categoryName: 'Fruits',
        price: 320.00,
        originalPrice: 380.00,
        discount: 18,
        rating: 4.9,
        reviewCount: 380,
        stock: 75,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1 kg (6-7 apples)', priceMultiplier: 1 },
            { label: '2 kg Pack', priceMultiplier: 1.9 }
        ],
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80'],
        shortDescription: 'Sweet, crunchy imported Gala apples.',
        description: 'Premium grade Royal Gala apples with thin red skin and sweet firm flesh.',
        ingredients: 'Fresh Red Apples',
        origin: 'New Zealand',
        storage: 'Refrigerate for long lasting crispiness.',
        expiry: '14 Days'
    },

    // --- SNACKS ---
    {
        id: 'snack-01',
        name: 'Lays Classic Salted Potato Chips',
        brand: 'Lays',
        category: 'snacks',
        categoryName: 'Snacks',
        price: 150.00,
        originalPrice: 180.00,
        discount: 15,
        rating: 4.8,
        reviewCount: 620,
        stock: 120,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '150g Family Pack', priceMultiplier: 1 },
            { label: 'Pack of 3', priceMultiplier: 2.85 }
        ],
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80'],
        shortDescription: 'Crispy wafer-thin potato chips seasoned with sea salt.',
        description: 'Made from specially selected farm potatoes for unmatched crunch.',
        ingredients: 'Potatoes, Edible Vegetable Oil, Salt',
        origin: 'USA / Local',
        storage: 'Store in a cool dry place.',
        expiry: '6 Months'
    },

    // --- BEVERAGES ---
    {
        id: 'bev-01',
        name: 'Tropicana 100% Pure Orange Juice',
        brand: 'Tropicana',
        category: 'beverages',
        categoryName: 'Beverages',
        price: 420.00,
        originalPrice: 500.00,
        discount: 16,
        rating: 4.8,
        reviewCount: 340,
        stock: 60,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1 Liter Bottle', priceMultiplier: 1 },
            { label: '2 Liter Family Bottle', priceMultiplier: 1.85 }
        ],
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80'],
        shortDescription: '100% squeezed orange juice with natural pulp. No added sugar.',
        description: 'Never from concentrate. Packed with daily Vitamin C requirement.',
        ingredients: '100% Pure Squeezed Orange Juice',
        origin: 'USA',
        storage: 'Keep refrigerated after opening.',
        expiry: '60 Days unopened'
    },

    // --- DAIRY ---
    {
        id: 'dairy-01',
        name: 'Anchor Full Cream Pasteurised Milk',
        brand: 'Anchor',
        category: 'dairy',
        categoryName: 'Dairy',
        price: 120.00,
        originalPrice: 140.00,
        discount: 12,
        rating: 4.9,
        reviewCount: 480,
        stock: 80,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1 Liter Carton', priceMultiplier: 1 },
            { label: 'Pack of 4 (1L)', priceMultiplier: 3.8 }
        ],
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80'],
        shortDescription: 'Pure fresh pasture-fed cow milk rich in Calcium & Protein.',
        description: 'Full cream milk with 3.5% fat content. Homogenized and UHT treated.',
        ingredients: '100% Fresh Cow Milk',
        origin: 'New Zealand',
        storage: 'Refrigerate below 4°C once opened.',
        expiry: '9 Months UHT'
    },

    // --- COOKING ESSENTIALS ---
    {
        id: 'cook-01',
        name: 'Fortune Pure Sunflower Cooking Oil',
        brand: 'Fortune',
        category: 'cooking-essentials',
        categoryName: 'Cooking Essentials',
        price: 950.00,
        originalPrice: 1150.00,
        discount: 17,
        rating: 4.8,
        reviewCount: 390,
        stock: 65,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '2 Liter Bottle', priceMultiplier: 1 },
            { label: '5 Liter Jar', priceMultiplier: 2.35 }
        ],
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'],
        shortDescription: 'Refined sunflower oil enriched with Vitamin A & D.',
        description: 'Light, healthy cooking oil with high smoke point suitable for frying and roasting.',
        ingredients: 'Refined Sunflower Oil',
        origin: 'India / Local',
        storage: 'Store away from light and heat.',
        expiry: '12 Months'
    },

    // --- SPICES ---
    {
        id: 'spice-01',
        name: 'Radhuni Pure Turmeric Powder',
        brand: 'Radhuni',
        category: 'spices',
        categoryName: 'Spices',
        price: 180.00,
        originalPrice: 220.00,
        discount: 20,
        rating: 4.9,
        reviewCount: 290,
        stock: 90,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '200g Pack', priceMultiplier: 1 },
            { label: '500g Pack', priceMultiplier: 2.3 }
        ],
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80'],
        shortDescription: 'Vibrant yellow ground turmeric rich in curcumin.',
        description: 'Ground from naturally dried high grade turmeric roots for deep color and flavor.',
        ingredients: '100% Ground Turmeric',
        origin: 'Bangladesh',
        storage: 'Keep in airtight spice container.',
        expiry: '18 Months'
    },

    // --- PERSONAL CARE ---
    {
        id: 'care-01',
        name: 'Dove Deeply Nourishing Body Wash',
        brand: 'Dove',
        category: 'personal-care',
        categoryName: 'Personal Care',
        price: 690.00,
        originalPrice: 850.00,
        discount: 18,
        rating: 4.9,
        reviewCount: 530,
        stock: 40,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '450ml Bottle', priceMultiplier: 1 },
            { label: '800ml Pump Bottle', priceMultiplier: 1.65 }
        ],
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'],
        shortDescription: 'Sulfate-free body wash with NutriumMoisture technology.',
        description: 'Leaves skin softer, smoother after just one shower.',
        ingredients: 'Water, Sodium Lauroyl Glycinate, Glycerin, Fragrance',
        origin: 'UK / Local',
        storage: 'Store in cool room.',
        expiry: '36 Months'
    },

    // --- HOUSEHOLD ---
    {
        id: 'house-01',
        name: 'Ariel Matic Front Load Detergent Powder',
        brand: 'Ariel',
        category: 'household',
        categoryName: 'Household Items',
        price: 1120.00,
        originalPrice: 1350.00,
        discount: 17,
        rating: 4.8,
        reviewCount: 410,
        stock: 35,
        inStock: true,
        isFeatured: true,
        status: 'active',
        weightVariants: [
            { label: '1.5 kg Pack', priceMultiplier: 1 },
            { label: '3 kg Value Pack', priceMultiplier: 1.85 }
        ],
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80',
        thumbnails: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80'],
        shortDescription: 'Tough stain removal in 1 wash for automatic washing machines.',
        description: 'Formulated with enzyme technology to clean cuffs and collars without fading colors.',
        ingredients: 'Anionic Surfactants, Oxygen Bleaching Agents, Enzymes',
        origin: 'India / Local',
        storage: 'Keep dry.',
        expiry: '24 Months'
    }
];

// --- Reactive Data Accessors ---
function getAllProducts() {
    return getProductsDB().filter(p => p.status !== 'disabled');
}

function getProductById(id) {
    return getProductsDB().find(p => p.id === id);
}

function getProductsByCategory(categorySlug) {
    return getProductsDB().filter(p => p.category.toLowerCase() === categorySlug.toLowerCase() && p.status !== 'disabled');
}

function getFeaturedProducts() {
    return getProductsDB().filter(p => p.isFeatured && p.status !== 'disabled');
}

function getAllCategories() {
    return getCategoriesDB().filter(c => c.status !== 'disabled');
}

function getActiveBanners() {
    return getBannersDB().filter(b => b.status === 'active').sort((a, b) => (a.order || 0) - (b.order || 0));
}
