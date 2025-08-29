<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@store.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

//        Category::factory(5)->create()->each(function ($category) {
//            Product::factory(10)->create([
//                'category_id' => $category->id,
//            ]);
//        });
//
//        // Example orders
//        Order::factory(3)->create()->each(function ($order) {
//            OrderItem::factory(2)->create([
//                'order_id' => $order->id,
//            ]);
//        });
//    }
    }
}
