<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ReplaceProductRequest;
use App\Http\Requests\Api\V1\StoreProductRequest;
use App\Http\Requests\Api\V1\UpdateProductRequest;
use App\Http\Resources\V1\ProductResource;
use App\Http\Traits\ApiResponses;
use App\Models\Category;
use App\Models\product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProductResource::collection(Product::with('category')->paginate(10));
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $product = Category::findOrFail($request->input('data.relationships.category.data.id'));
        } catch (ModelNotFoundException $e) {
            return $this->error('The provided category id does not exists');
        }
        $model = [
            'name' => $request->input('data.attributes.name'),
            'description' => $request->input('data.attributes.description'),
            'price' => $request->input('data.attributes.price'),
            'stock' => $request->input('data.attributes.stock'),
            'image' => $request->input('data.attributes.image'),
            'category_id' => $request->input('data.relationships.category.data.id')
        ];

        return new ProductResource(Product::create($model));
    }

    /**
     * Display the specified resource.
     */
    public function show($product_id)
    {
        try{
            $product = Product::with('category')->findOrFail($product_id);

            new ProductResource($product->load('category'));

        }catch(ModelNotFoundException $e){

            return $this->error('Product cannot be found.', 404);

        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, $product_id)
    {
        //PATCH

        try {
            $product = Product::findOrFail($product_id);

            $product->update($request->mappedAttributes());

            return new ProductResource($product->load('category'));
        }catch (ModelNotFoundException $e){
            return $this->error('Product cannot be found.', 404);
        }
    }

    /**
     * Replace the specified resource in storage.
     */
    public function replace(ReplaceProductRequest $request, $product_id)
    {
        try {
            $product = Product::findOrFail($product_id);

            $model = [
                'name'        => $request->input('data.attributes.name'),
                'description' => $request->input('data.attributes.description'),
                'price'       => $request->input('data.attributes.price'),
                'stock'       => $request->input('data.attributes.stock'),
                'category_id' => $request->input('data.relationships.category.data.id')
            ];


            $product->update($model);

            return new ProductResource($product->load('category'));

        } catch (ModelNotFoundException $e) {
            return $this->error('Product cannot be found.', 404);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $product_id)
    {
        try {
            $product = Product::findOrFail($product_id);


            $product->delete();

            // Return success with deleted category data
            return $this->success('Product successfully deleted');

        } catch (ModelNotFoundException $exception) {
            return $this->error('Product cannot be found.', 404);
        }
    }
}
