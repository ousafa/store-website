<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends BaseProductRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'data.attributes.name'        => 'sometimes|string|max:255',
            'data.attributes.description' => 'sometimes|nullable|string',
            'data.attributes.price'       => 'sometimes|numeric|min:0',
            'data.attributes.stock'       => 'sometimes|integer|min:0',
            'data.attributes.image'       => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'data.relationships.category.data.id' => 'sometimes|exists:categories,id',
        ];

        return $rules;
    }
}
