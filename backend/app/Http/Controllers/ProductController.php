<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        return Product::with(['images' => fn($q) => $q->active()->ordered()])
            ->paginate($request->per_page ?? 15);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cost' => 'required|numeric|min:0',
            'price' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    $cost = $request->input('cost');
                    $minPrice = $cost * 1.10;

                    if ($value < $minPrice) {
                        $fail("O preço de venda deve ser pelo menos 10% maior que o custo. Mínimo: R$ " . number_format($minPrice, 2, ',', '.'));
                    }
                }
            ],
            'description' => 'required|string',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produto criado com sucesso',
            'data' => $product
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


    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'cost' => 'sometimes|numeric|min:0',
            'price' => [
                'sometimes',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request, $product) {
                    $cost = $request->input('cost', $product->cost);
                    $minPrice = $cost * 1.10;

                    if ($value < $minPrice) {
                        $fail("O preço deve ser pelo menos 10% maior que o custo. Mínimo: R$ " . number_format($minPrice, 2, ',', '.'));
                    }
                }
            ],
            'description' => 'sometimes|string',
            'active' => 'sometimes|boolean',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Produto atualizado com sucesso',
            'data' => $product->fresh()
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

                    if (!preg_match('/^[a-zA-Z0-9]+-(\d+)$/', $originalName, $matches)) {
                        $fail("O nome do arquivo deve seguir o padrão 'nome-numero' (ex: camiseta-1).");
                        return;
                    }

                    $number = (int) $matches[1];
                    if ($number <= 0) {
                        $fail("O número após o traço deve ser maior que zero. Recebido: " . $number);
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
                [$baseName, $order] = explode('-', $originalName);
                $order = (int) $order;
                $extension = $image->getClientOriginalExtension();


                $existingImage = $product->images()
                    ->where('order', $order)
                    ->first();


                if ($existingImage) {
                    Storage::disk('public')->delete($existingImage->path);
                    $existingImage->delete();
                }


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

    public function updateStatus(Request $request, Product $product)
    {
        $request->validate([
            'active' => 'required|boolean'
        ]);

        $product->update([
            'active' => $request->active
        ]);

        return response()->json([
            'message' => $request->active
                ? 'Produto ativado com sucesso'
                : 'Produto desativado com sucesso',
            'data' => $product->fresh()
        ]);
    }
}