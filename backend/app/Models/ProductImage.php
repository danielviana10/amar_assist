<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{

    protected $fillable = ['product_id', 'path', 'order'];
    protected $casts = ['deleted' => 'boolean'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getUrlAttribute()
    {
        return asset("storage/{$this->path}");
    }

    public function scopeActive($query)
    {
        return $query->where('deleted', false);
    }
}