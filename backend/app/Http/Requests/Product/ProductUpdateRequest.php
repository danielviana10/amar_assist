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
            'price' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:100000',
                function ($attribute, $value, $fail) {
                    $cost = $this->input('cost', $this->product->cost ?? 0);
                    $minPrice = $cost * 1.10;

                    if ($value < $minPrice) {
                        $fail("O preço deve ser pelo menos 10% maior que o custo. Mínimo: R$ " . number_format($minPrice, 2, ',', '.'));
                    }
                }
            ],
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
}