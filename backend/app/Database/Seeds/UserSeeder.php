<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $existing = $this->db->table('users')
            ->where('email', 'admin@prueba.com')
            ->get()
            ->getRowArray();

        if ($existing !== null) {
            return;
        }

        $now = date('Y-m-d H:i:s');

        $this->db->table('users')->insert([
            'name'          => 'Administrador',
            'email'         => 'admin@prueba.com',
            'password_hash' => password_hash('123456', PASSWORD_DEFAULT),
            'created_at'    => $now,
            'updated_at'    => $now,
        ]);
    }
}

