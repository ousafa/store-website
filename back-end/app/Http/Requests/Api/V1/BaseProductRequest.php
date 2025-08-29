<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class BaseProductRequest extends FormRequest
{

    public  function mappedAttributes(){
        $attributeMap = [
            'data.attributes.name'        => 'name',
            'data.attributes.description' => 'description',
            'data.attributes.price'       => 'price',
            'data.attributes.stock'       => 'stock',
            'data.attributes.image'       => 'image',
           'data.relationships.category.data.id' => 'category_id',
        ];

        $attributesToUpdate = [];
        foreach ($attributeMap as $key => $attribute) {
            if($this->has($key)){
                $attributesToUpdate[$attribute] =$this->input($key);
            }
        }
        return $attributesToUpdate;
    }

    public function messages() {
        return [
            'data.attributes.image' => 'The data.attributes.image type is invalid. Only jpg, jpeg, png allowed.'
        ];
    }
}
