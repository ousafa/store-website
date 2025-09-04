<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends BaseOrderRequest
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
        return [
            'data.attributes.user_id' => 'required|exists:users,id',
            'data.attributes.status' => 'string|in:pending,paid,cancelled',
            //'data.attributes.total' => 'required|numeric|min:10',

            'data.includes.items' => 'required|array|min:1',

            'data.includes.items.*.product_id' => 'required|exists:products,id',
            'data.includes.items.*.quantity'   => 'required|integer|min:1',
            'data.includes.items.*.price'      => 'required|numeric|min:0',
        ];
    }


}
