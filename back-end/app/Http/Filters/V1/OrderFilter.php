<?php

namespace App\Http\Filters\V1;

class OrderFilter extends QueryFilter {
    protected $sortable = [
        'total',
        'status',
        'createdAt' => 'created_at',
        'updatedAt' => 'updated_at'
    ];

    public function username($value)
    {
        $users = array_map('trim', explode(',', $value));

        return $this->builder->whereHas('user', function ($query) use ($users) {
            $query->whereIn('name', $users);
        });
    }



    public function total($value)
    {
        $values = array_map('trim', explode(',', $value));

        if (count($values) === 2) {
            // Range filter
            return $this->builder->whereBetween('total', $values);
        }

        return $this->builder->where('total', $values[0]);
    }

    public function status($value) {
        return $this->builder->whereIn('status', explode(',', $value));
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
