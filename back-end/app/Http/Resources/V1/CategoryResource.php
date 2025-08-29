<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'category',
            'id'    => $this->id,
            'attributes' => ['name'  => $this->name,
                'description' => $this->description,
                $this->mergeWhen($request->routeIs('categories.*'), [
                    'createdAt' => $this->created_at,
                    'udpatedAt' => $this->updated_at,
                ])
            ],
            'links' => [
                'self' => route('categories.show', ['category' => $this->id])
            ]
        ];
    }
}
