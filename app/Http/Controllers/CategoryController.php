<?php

namespace App\Http\Controllers;

use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->leftJoin('categories as parents', 'categories.parent_id', '=', 'parents.id')
            ->select('categories.*', 'parents.name as parent_name')
            ->when(
                $request->search,
                fn($q, $search) =>
                $q->where('categories.name', 'like', '%' . $search . '%')
            )
            ->when(
                $request->is_active !== null,
                fn($q) =>
                $q->where('categories.is_active', $request->is_active === '1')
            )
            ->when(
                $request->sort,
                fn($q) =>
                $q->orderBy($request->sort, $request->input('direction', 'asc')),
                fn($q) => $q->orderBy('categories.created_at', 'desc')
            )
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $pagination = [
            'current_page' => $categories->currentPage(),
            'last_page'    => $categories->lastPage(),
            'per_page'     => $categories->perPage(),
            'total'        => $categories->total(),
        ];

        $parentCategories = Category::with('children')->whereNull('parent_id')->get();

        return Inertia::render('categories/index', [
            'categories'       => $categories,
            'pagination'       => $pagination,
            'parentCategories' => $parentCategories,
            'filters'          => $request->only([
                'search',
                'is_active',
                'sort',
                'direction',
                'page',
                'per_page'
            ]),
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

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update([
            'name'        => $request->name,
            'description' => $request->description,
            'parent_id'   => $request->parent_id,
            'slug'        => Str::slug($request->name),
            'is_active'   => $request->is_active,
        ]);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
