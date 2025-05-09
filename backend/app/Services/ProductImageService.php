<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductImageService
{
    public function processImages(array $images, Product $product): array
    {
        $uploadedImages = [];

        foreach ($images as $image) {
            try {
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $lastHyphenPos = strrpos($originalName, '-');
                $baseName = substr($originalName, 0, $lastHyphenPos);
                $order = (int) substr($originalName, $lastHyphenPos + 1);
                $extension = $image->getClientOriginalExtension();

                $existingImage = ProductImage::where('product_id', $product->id)
                    ->where('order', $order)
                    ->first();

                $path = $image->storeAs(
                    "products/{$product->id}",
                    "{$baseName}-{$order}.{$extension}",
                    'public'
                );

                if ($existingImage) {
                    Storage::disk('public')->delete($existingImage->path);
                    $existingImage->update(['path' => $path, 'deleted' => false]);
                    $uploadedImages[] = $existingImage;
                } else {
                    $uploadedImages[] = ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $path,
                        'order' => $order,
                        'deleted' => false,
                    ]);
                }

            } catch (\Exception $e) {
                Log::error("Erro ao processar imagem {$originalName}: " . $e->getMessage());
                continue;
            }
        }

        return $uploadedImages;
    }
}
