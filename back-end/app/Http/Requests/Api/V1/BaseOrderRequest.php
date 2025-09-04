<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class BaseOrderRequest extends FormRequest
{
    public  function mappedAttributes(){
        $attributeMap = [
                'data.attributes.user_id' => 'user_id',
                'data.attributes.status' => 'status',
                'data.attributes.total' => 'total',

//                'data.includes.items.*.product_id' => 'product_id',
//                'data.includes.items.*.quantity'   => 'quantity',
//                'data.includes.items.*.price'      => 'price',
        ];

        $attributesToUpdate = [];
        foreach ($attributeMap as $key => $attribute) {
            if($this->has($key)){
                $attributesToUpdate[$attribute] =$this->input($key);
            }
        }
        return $attributesToUpdate;
    }

    public function attributes(): array
    {
        return [
            'data.attributes.user_id' => 'user',

            'data.includes.items.*.product_id' => 'products',
            'data.includes.items.*.quantity'   => 'quantity',
            'data.includes.items.*.price'      => 'price',
        ];
    }
    public function messages(): array
    {
        return [
            'data.attributes.user_id.required' => 'La commande doit être associée à un utilisateur.',
            'data.attributes.user_id.exists'   => 'L’utilisateur sélectionné n’existe pas.',
            'items.required'   => 'La commande doit contenir au moins un article.',
            'items.*.product_id.exists' => 'Le produit sélectionné n’existe pas.',
        ];
    }
}
