<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\ProductIndexRequest;
use App\Http\Requests\Product\ProductRequest;
use App\Http\Requests\Product\ProductStatusUpdateRequest;
use App\Http\Requests\Product\ProductUpdateRequest;
use App\Models\Product;
use App\Services\ProductService;

class ProductController extends Controller
{

    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(ProductIndexRequest $request)
    {
        $perPage = $request->per_page ?? 10;
        $search = $request->search;

        return $this->productService->getProducts($perPage, $search);
    }


    public function store(ProductRequest $request)
    {
        $validated = $request->validated();
        $product = $this->productService->createProduct($validated);

        return response()->json([
            'message' => 'Produto criado com sucesso',
            'data' => $product->makeHidden(['created_at', 'updated_at']),
        ], 201);
    }


    public function show($id)
    {
        $product = $this->productService->findWithImages($id);

        if (!$product) {
            return response()->json([
                'message' => 'Produto não encontrado.',
            ], 404);
        }

        return response()->json([
            'data' => $product
        ]);
    }


    public function update(ProductUpdateRequest $request, Product $product)
    {
        $updatedProduct = $this->productService->update($request->validated(), $product);

        return response()->json([
            'message' => 'Produto atualizado com sucesso',
            'data' => $updatedProduct,
        ]);
    }

    public function updateStatus(ProductStatusUpdateRequest $request, Product $product)
    {
        $updatedProduct = $this->productService->updateStatus($product, $request->boolean('active'));

        return response()->json([
            'message' => $updatedProduct->active
                ? 'Produto ativado com sucesso'
                : 'Produto desativado com sucesso',
            'data' => $updatedProduct
        ]);
    }
}
