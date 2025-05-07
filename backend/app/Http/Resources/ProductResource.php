<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'price' => $this->price,
            'cost' => $this->cost,
            'description' => $this->description,
            'active' => $this->active,
            'image' => $this->firstImage ? [
                'id' => $this->firstImage->id,
                'product_id' => $this->firstImage->product_id,
                'path' => $this->firstImage->path,
                'order' => $this->firstImage->order,
                'deleted' => $this->firstImage->deleted,
            ] : null
        ];
    }
}