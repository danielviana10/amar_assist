<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductStatusUpdateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'active' => ['boolean']
        ];
    }

    public function messages()
    {
        return [
            'active.boolean' => 'O campo active deve ser verdadeiro ou falso.',
        ];
    }
}