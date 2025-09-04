<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class BaseOrderItemRequest extends FormRequest
{
    public  function mappedAttributes(){
        $attributeMap = [
            'data.includes.items' =>'items',

            'data.includes.items.*.product_id' => 'product_id',
            'data.includes.items.*.quantity'   => 'quantity',
            'data.includes.items.*.price'      => 'price',
        ];

        $attributesToUpdate = [];
        foreach ($attributeMap as $key => $attribute) {
            if($this->has($key)){
                $attributesToUpdate[$attribute] =$this->input($key);
            }
        }
        return $attributesToUpdate;
    }

}
