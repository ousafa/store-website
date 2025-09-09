<?php

namespace App\Http\Filters\V1;

class CategoryFilter extends QueryFilter
{
    protected $sortable = [
        'name',
        'createdAt' => 'created_at',
        'updatedAt' => 'updated_at'
    ];
    public function name($value)
    {
        // Replace * with % and wrap with wildcards if not already
        $likeStr = '%' . str_replace('*', '%', $value) . '%';
        return $this->builder->where('name', 'like', $likeStr);
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
