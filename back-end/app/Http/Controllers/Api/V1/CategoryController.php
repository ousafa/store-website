<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Filters\V1\CategoryFilter;
use App\Http\Requests\Api\V1\ReplaceCategoryRequest;
use App\Http\Requests\Api\V1\ReplaceProductRequest;
use App\Http\Requests\Api\V1\StoreCategoryRequest;
use App\Http\Requests\Api\V1\UpdateCategoryRequest;
use App\Http\Resources\V1\CategoryResource;
use App\Http\Traits\ApiResponses;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponses;
    public function index(CategoryFilter $filters)
    {
        return CategoryResource::collection(
            Category::filter($filters)
            ->latest()
            ->paginate(8)
        );
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {

        $model = [
            'name' => $request->input('data.attributes.name'),
            'description' => $request->input('data.attributes.description'),
        ];

        return new CategoryResource(Category::create($model));
    }

    /**
     * Display the specified resource.
     */
    public function show($category_id)
    {
        try{
            $category = Category::findOrFail($category_id);

            return new CategoryResource($category);

        }catch(ModelNotFoundException $e){

            return $this->error('Category cannot be found.', 404);

        }

    }
    /**
     * Rplace the specified resource in storage.
     */
    public function replace(ReplaceCategoryRequest $request, $category_id) {
        // PUT
        try {
            $category = Category::findOrFail($category_id);

            $model = [
                'name' => $request->input('data.attributes.name'),
                'description' => $request->input('data.attributes.description'),
            ];

            $category->update($model);

            return new CategoryResource($category);

        } catch (ModelNotFoundException $exception) {
            return $this->error('Category cannot be found.', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, $category_id)
    {
        //PATCH

        try {
            $category = Category::findOrFail($category_id);

            $category->update($request->mappedAttributes());

            return new CategoryResource($category);
        }catch (ModelNotFoundException $e){
            return $this->error('Category cannot be found.', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $category_id)
    {
        try {
            $category = Category::findOrFail($category_id);

            $category->delete();

            return $this->success('Category successfully deleted');

        } catch (ModelNotFoundException $exception) {
            return $this->error('Category cannot be found.', 404);
        }
    }

}
