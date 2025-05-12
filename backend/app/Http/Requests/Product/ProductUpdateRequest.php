<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:40',
            'cost' => 'sometimes|numeric|min:0|max:100000',
            'price' => 'sometimes|numeric|min:0|max:100000',
            'description' => 'sometimes|string|max:200',
        ];
    }

    public function messages()
    {
        return [
            'title.string' => 'O título deve ser um texto.',
            'cost.numeric' => 'O custo deve ser numérico.',
            'price.numeric' => 'O preço deve ser numérico.',
            'description.string' => 'A descrição deve ser um texto.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $product = $this->route('product');
            $currentPrice = $product->price ?? 0;
            $currentCost = $product->cost ?? 0;

            $price = $this->input('price', $currentPrice);
            $cost = $this->input('cost', $currentCost);

            $minPrice = $cost * 1.10;

            if ($this->has('price') && $price < $minPrice) {
                $validator->errors()->add(
                    'price',
                    'O preço deve ser pelo menos 10% maior que o custo. Mínimo: R$ ' . number_format($minPrice, 2, ',', '.')
                );
            }

            if ($this->has('cost') && !$this->has('price') && $currentPrice < $minPrice) {
                $validator->errors()->add(
                    'cost',
                    'Com esse novo custo, o preço atual deveria ser no mínimo R$ ' . number_format($minPrice, 2, ',', '.') . '. Atualize o preço também.'
                );
            }
        });

        return $validator;
    }
}
