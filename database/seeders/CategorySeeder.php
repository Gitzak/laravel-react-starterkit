<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Men'   => ['T-Shirts', 'Pants', 'Shoes', 'Accessories'],
            'Women' => ['Dresses', 'Blouses', 'Heels', 'Bags'],
            'Kids'  => ['Tops', 'Shorts', 'Sneakers', 'Toys'],
        ];

        foreach ($categories as $main => $subs) {
            $parent = Category::create([
                'name'        => $main,
                'description' => "$main clothing category",
                'slug'        => Str::slug($main),
                'parent_id'   => null,
                'is_active'   => true,
            ]);

            foreach ($subs as $sub) {
                Category::create([
                    'name'        => $sub,
                    'description' => "$sub for $main",
                    'slug'        => Str::slug($main . '-' . $sub),
                    'parent_id'   => $parent->id,
                    'is_active'   => true,
                ]);
            }
        }
    }
}
