<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('parent')->get(); // for table
        $parentCategories = Category::with('children')->whereNull('parent_id')->get(); // tree

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        Category::create([
            ...$request->validated(),
            'slug' => Str::slug($request->name),
        ]);

        return back()->with('success', 'Category created successfully.');
    }
}
