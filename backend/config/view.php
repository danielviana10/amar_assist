<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Storage Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. However, you may change this if you wish.
    |
    */
    'paths' => [
        resource_path('views'),
    ],

    'compiled' => env('VIEW_COMPILED_PATH', realpath(storage_path('framework/views'))),

];