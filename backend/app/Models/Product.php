<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    protected $fillable = [
        'title',
        'price',
        'cost',
        'description',
        'active',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class)->active()->orderBy('order');
    }

    public function getFirstImageAttribute()
    {
        return $this->images()->first();
    }
}
