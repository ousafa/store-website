<?php

namespace App\Http\Filters\V1;

use App\Models\Category;

class ProductFilter extends QueryFilter
{
    protected $sortable = [
        'name',
        'category',
        'price',
        'stock',
        'createdAt' => 'created_at',
        'updatedAt' => 'updated_at'
    ];
    public function name($value)
    {
        // Replace * with % and wrap with wildcards if not already
        $likeStr = '%' . str_replace('*', '%', $value) . '%';
        return $this->builder->where('name', 'like', $likeStr);
    }

    public function category($value)
    {
        // Allow multiple category names separated by commas
        $categories = array_map('trim', explode(',', $value));

        return $this->builder->whereHas('category', function ($query) use ($categories) {
            $query->whereIn('name', $categories);
        });
    }


    public function price($value)
    {
        $values = array_map('trim', explode(',', $value));

        if (count($values) === 2) {
            // Range filter
            return $this->builder->whereBetween('price', $values);
        }

        return $this->builder->where('price', $values[0]);
    }

    public function stock($value)
    {
        $values = array_map('trim', explode(',', $value));

        if (count($values) === 2) {
            return $this->builder->whereBetween('stock', $values);
        }

        return $this->builder->where('stock', $values[0]);
    }

    public function createdAt($value)
    {
        $dates = array_map('trim', explode(',', $value));

        if (count($dates) === 2) {
            return $this->builder->whereBetween('created_at', $dates);
        }

        return $this->builder->whereDate('created_at', $dates[0]);
    }

    public function updatedAt($value)
    {
        $dates = array_map('trim', explode(',', $value));

        if (count($dates) === 2) {
            return $this->builder->whereBetween('updated_at', $dates);
        }

        return $this->builder->whereDate('updated_at', $dates[0]);
    }
}
