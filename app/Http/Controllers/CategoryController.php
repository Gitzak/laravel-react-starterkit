<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::with('parent')
            ->when(
                $request->search,
                fn($q, $search) =>
                $q->where('name', 'like', '%' . $search . '%')
            )
            ->when(
                $request->is_active !== null,
                fn($q) =>
                $q->where('is_active', $request->is_active === '1')
            )
            ->when(
                $request->sort,
                fn($q, $sort) =>
                $q->orderBy($sort, $request->input('direction', 'asc')),
                fn($q) => $q->orderBy('created_at', 'desc')
            )
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $parentCategories = Category::with('children')->whereNull('parent_id')->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'parentCategories' => $parentCategories,
            'filters' => $request->only(['search', 'is_active', 'sort', 'direction', 'page', 'per_page']),
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
