<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|string|max:50|unique:products',
            'cost' => 'required|numeric|min:0|max:100000',
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:100000',
                function ($attribute, $value, $fail) {
                    $cost = $this->input('cost');
                    $minPrice = $cost * 1.10;

                    if ($value < $minPrice) {
                        $fail("O preço de venda deve ser pelo menos 10% maior que o custo. Mínimo: R$ " . number_format($minPrice, 2, ',', '.'));
                    }
                }
            ],
            'description' => 'required|string|max:200',
            'active' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'O título é obrigatório.',
            'title.unique' => 'O título já está em uso.',
            'cost.required' => 'O custo é obrigatório.',
            'price.required' => 'O preço é obrigatório.',
            'price.min' => 'O preço de venda deve ser pelo menos 10% maior que o custo.',
            'description.required' => 'A descrição é obrigatória.',
            'active.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }
}