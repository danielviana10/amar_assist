<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
class ProductImageUploadRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
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
        ];
    }

    public function messages()
    {
        return [
            'images.*.mimes' => 'Apenas formatos JPG, JPEG e PNG são permitidos.',
            'images.*.max' => 'O tamanho máximo da imagem é 2MB.',
        ];
    }
}