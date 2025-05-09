<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\ProductImage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $product = Product::create([
            'title' => 'Camisa do Brasil',
            'price' => 129.99,
            'cost' => 89.99,
            'description' => 'Camisa oficial da Seleção Brasileira, edição limitada.',
            'active' => true,
        ]);

        $imageFiles = [
            'camisa_do_brasil-1.png',
            'camisa_do_brasil-2.png',
            'camisa_do_brasil-3.png',
        ];

        $directory = "products/{$product->id}";
        Storage::disk('public')->makeDirectory($directory);

        foreach ($imageFiles as $index => $fileName) {
            $sourcePath = database_path("images/{$fileName}");
            $targetPath = "{$directory}/{$fileName}";

            if (file_exists($sourcePath)) {
                Storage::disk('public')->put($targetPath, file_get_contents($sourcePath));

                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $targetPath,
                    'order' => $index + 1,
                    'deleted' => false,
                ]);
            }
        }
    }
}
