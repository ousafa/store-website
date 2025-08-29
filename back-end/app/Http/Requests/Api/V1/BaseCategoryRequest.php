<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class BaseCategoryRequest extends FormRequest
{
    public  function mappedAttributes(){
        $attributeMap = [
            'data.attributes.name'        => 'name',
            'data.attributes.description' => 'description',
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
