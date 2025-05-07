<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Defina os comandos do console para sua aplicação.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Configure a programação dos comandos de console.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        //
    }

    /**
     * Registre os comandos de console para sua aplicação.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}