<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductImageController extends Controller
{

    protected $productImageService;

    public function __construct(ProductImageService $productImageService)
    {
        $this->productImageService = $productImageService;
    }

    public function index(Product $product)
    {
        $images = $product->images()->active()->orderBy('order')->get();

        return response()->json([
            'data' => $images
        ]);
    }

        public function addImages(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|min:1',
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
                function ($attribute, $value, $fail) {
                    $originalName = pathinfo($value->getClientOriginalName(), PATHINFO_FILENAME);
                    if (!preg_match('/^.+?-(\d+)$/', $originalName, $matches)) {
                        $fail("O nome do arquivo deve terminar com '-número'.");
                        return;
                    }
                    if ((int) $matches[1] <= 0) {
                        $fail("O número após o hífen deve ser maior que zero.");
                    }
                }
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $uploadedImages = $this->productImageService->processImages($request->file('images'), $product);

        if (empty($uploadedImages)) {
            return response()->json([
                'message' => 'Nenhuma imagem foi processada',
                'errors' => [
                    'images' => ['Verifique o formato dos nomes dos arquivos']
                ]
            ], 422);
        }

        return response()->json([
            'message' => 'Imagens processadas com sucesso',
            'data' => $product->images()->orderBy('order')->get(),
            'product_id' => $product->id
        ], 201);
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