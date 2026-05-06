"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const users_service_1 = require("../src/users/users.service");
const categories_service_1 = require("../src/categories/categories.service");
const products_service_1 = require("../src/products/products.service");
const user_entity_1 = require("../src/users/user.entity");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const categoriesService = app.get(categories_service_1.CategoriesService);
    const productsService = app.get(products_service_1.ProductsService);
    console.log('🌱 Seeding GrocerX database...');
    const adminExists = await usersService.findByEmail('admin@grocerx.com');
    if (!adminExists) {
        await usersService.create({
            email: 'admin@grocerx.com',
            password: 'password123',
            fullName: 'GrocerX Admin',
            phone: '+92-300-0000001',
            role: user_entity_1.UserRole.ADMIN,
            isVerified: true,
        });
        console.log('✅ Admin created: admin@grocerx.com / password123');
    }
    const riderExists = await usersService.findByEmail('rider@grocerx.com');
    if (!riderExists) {
        await usersService.create({
            email: 'rider@grocerx.com',
            password: 'password123',
            fullName: 'Ali Khan (Rider)',
            phone: '+92-300-0000002',
            role: user_entity_1.UserRole.RIDER,
            isVerified: true,
        });
        console.log('✅ Rider created: rider@grocerx.com / password123');
    }
    const customerExists = await usersService.findByEmail('customer@grocerx.com');
    if (!customerExists) {
        await usersService.create({
            email: 'customer@grocerx.com',
            password: 'password123',
            fullName: 'Sara Ahmed',
            phone: '+92-300-0000003',
            address: 'DHA Phase 5, Lahore',
            role: user_entity_1.UserRole.CUSTOMER,
            isVerified: true,
        });
        console.log('✅ Customer created: customer@grocerx.com / password123');
    }
    const categories = [
        { name: 'Fruits & Vegetables', icon: '🥬', color: '#4CAF50', sortOrder: 1 },
        { name: 'Bakery', icon: '🍞', color: '#FF7A01', sortOrder: 2 },
        { name: 'Dairy & Eggs', icon: '🥛', color: '#2196F3', sortOrder: 3 },
        { name: 'Meat & Fish', icon: '🥩', color: '#F44336', sortOrder: 4 },
        { name: 'Snacks', icon: '🍿', color: '#9C27B0', sortOrder: 5 },
        { name: 'Beverages', icon: '🧃', color: '#00BCD4', sortOrder: 6 },
        { name: 'Pantry', icon: '🫙', color: '#795548', sortOrder: 7 },
        { name: 'Frozen Foods', icon: '🧊', color: '#607D8B', sortOrder: 8 },
    ];
    const createdCategories = {};
    for (const cat of categories) {
        let existing;
        try {
            const allCats = await categoriesService.findAll();
            existing = allCats.find((c) => c.name === cat.name);
        }
        catch { }
        if (!existing) {
            const created = await categoriesService.create(cat);
            createdCategories[cat.name] = created;
            console.log(`✅ Category: ${cat.icon} ${cat.name}`);
        }
        else {
            createdCategories[cat.name] = existing;
        }
    }
    const products = [
        {
            name: 'Organic Bananas (1kg)',
            description: 'Fresh organic bananas from local farms',
            priceInCents: 18000,
            stock: 100,
            unit: 'kg',
            imageUrl: '/uploads/products/bananas.webp',
            categoryName: 'Fruits & Vegetables',
        },
        {
            name: 'Red Apples (500g)',
            description: 'Crisp and sweet imported red apples',
            priceInCents: 32000,
            stock: 75,
            unit: '500g',
            imageUrl: '/uploads/products/red-apples.webp',
            categoryName: 'Fruits & Vegetables',
        },
        {
            name: 'Sourdough Bread',
            description: 'Freshly baked artisan sourdough',
            priceInCents: 45000,
            stock: 30,
            unit: 'loaf',
            imageUrl: '/uploads/products/sourdough.webp',
            categoryName: 'Bakery',
        },
        {
            name: 'Croissants (4pcs)',
            description: 'Flaky, buttery French croissants',
            priceInCents: 38000,
            stock: 40,
            unit: '4 pcs',
            imageUrl: '/uploads/products/croissants.webp',
            categoryName: 'Bakery',
        },
        {
            name: 'Full Cream Milk (1L)',
            description: 'Fresh pasteurized full cream milk',
            priceInCents: 22000,
            stock: 120,
            unit: '1L',
            imageUrl: '/uploads/products/milk.webp',
            categoryName: 'Dairy & Eggs',
        },
        {
            name: 'Farm Fresh Eggs (12pcs)',
            description: 'Free-range large brown eggs',
            priceInCents: 35000,
            stock: 80,
            unit: 'dozen',
            imageUrl: '/uploads/products/eggs.webp',
            categoryName: 'Dairy & Eggs',
        },
        {
            name: 'Mineral Water (1.5L)',
            description: 'Pure natural spring water',
            priceInCents: 8000,
            stock: 200,
            unit: '1.5L',
            imageUrl: '/uploads/products/water.webp',
            categoryName: 'Beverages',
        },
        {
            name: 'Mixed Nuts (250g)',
            description: 'Premium blend of cashews, almonds, and walnuts',
            priceInCents: 85000,
            stock: 50,
            unit: '250g',
            imageUrl: '/uploads/products/mixed-nuts.webp',
            categoryName: 'Snacks',
        },
    ];
    for (const prod of products) {
        const { categoryName, ...productData } = prod;
        const category = createdCategories[categoryName];
        if (category) {
            try {
                await productsService.create({
                    ...productData,
                    categoryId: category.id,
                });
                console.log(`✅ Product: ${prod.name}`);
            }
            catch (err) {
                console.log(`⚠️  Product skipped (may exist): ${prod.name}`);
            }
        }
    }
    console.log('\n🎉 Seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin    → admin@grocerx.com / password123');
    console.log('Rider    → rider@grocerx.com / password123');
    console.log('Customer → customer@grocerx.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await app.close();
}
seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map