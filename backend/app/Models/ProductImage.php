<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{

    protected $fillable = ['product_id', 'path', 'order', 'deleted'];
    protected $casts = ['deleted' => 'boolean'];
    protected $hidden = [
        'created_at',
        'updated_at'
    ];


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


    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
