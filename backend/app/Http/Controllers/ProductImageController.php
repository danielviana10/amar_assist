<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function index()
    {
        return Product::with([
            'images' => function ($query) {
                $query->active()->orderBy('order');
            }
        ])->get();
    }

    public function update(Request $request, ProductImage $image)
    {
        $validated = $request->validate([
            'order' => 'sometimes|integer|min:0'
        ]);

        $image->update($validated);

        return response()->json([
            'message' => 'Imagem atualizada com sucesso',
            'data' => $image->fresh()
        ]);
    }

    public function destroy(ProductImage $image)
    {
        $image->update(['deleted' => true]);

        $this->reorganizeOrder($image->product);

        return response()->json([
            'message' => 'Imagem marcada como deletada'
        ]);
    }

    protected function reorganizeOrder(Product $product)
    {
        $images = $product->images()->active()->orderBy('order')->get();

        foreach ($images as $index => $image) {
            $image->update(['order' => $index]);
        }
    }
}