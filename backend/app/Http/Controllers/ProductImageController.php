<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function index(Product $product)
    {
        $images = $product->images()->active()->orderBy('order')->get();

        return response()->json([
            'data' => $images
        ]);
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
        $updated = $image->update(['deleted' => true]);

        return response()->json([
            'message' => 'Imagem marcada como deletada',
            'success' => $updated,
            'deleted' => $image->fresh()
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