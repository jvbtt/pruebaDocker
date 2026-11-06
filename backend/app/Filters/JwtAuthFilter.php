<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Throwable;

class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if ($authHeader === '' || ! str_starts_with($authHeader, 'Bearer ')) {
            return Services::response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => 'error',
                    'message' => 'Token de autenticación no proporcionado.',
                ]);
        }

        $token  = trim(substr($authHeader, 7));
        $secret = (string) env('JWT_SECRET', 'clave_secreta_desarrollo_ci4_react_2026_segura_32bytes!');

        try {
            JWT::decode($token, new Key($secret, 'HS256'));
        } catch (Throwable $e) {
            return Services::response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => 'error',
                    'message' => 'Token inválido o expirado.',
                ]);
        }

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}

