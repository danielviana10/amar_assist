<?php

namespace App\Services;

use App\Models\Product;

class ProductService
{
    public function getProducts($perPage, $search = null)
    {
        return Product::with(['images' => fn($q) => $q->active()->ordered()])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
    public function createProduct($data)
    {
        return Product::create($data);
    }

    public function update(array $data, Product $product): Product
    {
        $product->update($data);
        return $product->fresh();
    }

    public function updateStatus(Product $product, bool $active): Product
    {
        $product->update(['active' => $active]);
        return $product->fresh();
    }

}