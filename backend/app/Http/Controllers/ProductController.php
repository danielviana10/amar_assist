<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\ProductIndexRequest;
use App\Http\Requests\Product\ProductRequest;
use App\Http\Requests\Product\ProductStatusUpdateRequest;
use App\Http\Requests\Product\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'data' => new ProductResource($product),
        ], 201);
    }


    public function show(Product $product)
    {
        return $product->load([
            'images' => function ($query) {
                $query->where('deleted', false)
                    ->orderBy('order');
            }
        ]);
    }


    public function update(ProductUpdateRequest $request, Product $product)
    {
        $updatedProduct = $this->productService->update($request->validated(), $product);

        return response()->json([
            'message' => 'Produto atualizado com sucesso',
            'data' => new ProductResource($updatedProduct),
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
                        $fail("O nome do arquivo deve terminar com '-número' (ex: camiseta-1 ou camiseta_alemanha-1).");
                        return;
                    }

                    $number = (int) $matches[1];
                    if ($number <= 0) {
                        $fail("O número após o hífen deve ser maior que zero. Recebido: " . $number);
                    }
                }
            ]
        ], [
            'images.*.mimes' => 'Apenas formatos JPG, JPEG e PNG são permitidos.',
            'images.*.max' => 'O tamanho máximo da imagem é 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $uploadedImages = [];

        foreach ($request->file('images') as $image) {
            try {
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $lastHyphenPos = strrpos($originalName, '-');
                $baseName = substr($originalName, 0, $lastHyphenPos);
                $order = (int) substr($originalName, $lastHyphenPos + 1);
                $extension = $image->getClientOriginalExtension();

                $existingImage = ProductImage::where('product_id', $product->id)
                    ->where('order', $order)
                    ->first();

                if ($existingImage) {
                    Storage::disk('public')->delete($existingImage->path);

                    $path = $image->storeAs(
                        "products/{$product->id}",
                        "{$baseName}-{$order}.{$extension}",
                        'public'
                    );

                    $existingImage->update([
                        'path' => $path,
                        'deleted' => false
                    ]);

                    $uploadedImages[] = $existingImage;
                } else {
                    $path = $image->storeAs(
                        "products/{$product->id}",
                        "{$baseName}-{$order}.{$extension}",
                        'public'
                    );

                    $uploadedImages[] = ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $path,
                        'order' => $order,
                        'deleted' => false
                    ]);
                }

            } catch (\Exception $e) {
                \Log::error("Erro ao processar imagem {$originalName}: " . $e->getMessage());
                continue;
            }
        }

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