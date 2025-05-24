<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['T-Shirt Slim Fit', 'Slim fit cotton T-shirt for Men', 19.99, 'men-t-shirts'],
            ['Classic Pants', 'Straight fit men pants, navy blue', 39.99, 'men-pants'],
            ['Running Shoes', 'Lightweight men running shoes', 59.99, 'men-shoes'],
            ['Leather Belt', 'Genuine leather belt for men', 24.50, 'men-accessories'],
            ['Summer Dress', 'Floral print summer dress', 49.90, 'women-dresses'],
            ['Blouse Elegant', 'White office blouse for women', 29.99, 'women-blouses'],
            ['High Heels', 'Red high heels - size 37 to 41', 69.00, 'women-heels'],
            ['Shoulder Bag', 'Compact shoulder bag with strap', 34.75, 'women-bags'],
            ['Kids Sneakers', 'Comfortable sneakers for kids', 27.30, 'kids-sneakers'],
            ['Soft Toys', 'Plush stuffed toy for kids', 14.99, 'kids-toys'],
        ];

        foreach ($products as [$name, $desc, $price, $slug]) {
            $category = Category::where('slug', $slug)->first();
            if ($category) {
                Product::create([
                    'name'        => $name,
                    'description' => $desc,
                    'price'       => $price,
                    'sku'         => strtoupper(Str::random(8)),
                    'stock'       => rand(10, 100),
                    'is_active'   => true,
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
