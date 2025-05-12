<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductIndexRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'per_page' => 'nullable|integer|min:1|max:50',
            'search' => 'nullable|string|min:2|max:40',
        ];
    }

    public function messages()
    {
        return [
            'per_page.min' => 'O valor de "per_page" deve ser no mínimo 1 para garantir uma navegação adequada.',
            'per_page.numeric' => 'O campo "per_page" deve ser um número válido.',
            'search.min' => 'A busca deve conter pelo menos 2 caracteres.',
            'search.max' => 'A busca não pode exceder 40 caracteres.',
        ];
    }
}