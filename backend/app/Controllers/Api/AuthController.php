<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Throwable;

class AuthController extends BaseController
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function login(): ResponseInterface
    {
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[4]',
        ];

        if (! $this->validateData($payload, $rules)) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_UNPROCESSABLE_ENTITY)
                ->setJSON([
                    'status'  => 'error',
                    'message' => 'Por favor ingrese un correo válido y su contraseña.',
                    'errors'  => $this->validator->getErrors(),
                ]);
        }

        $email    = trim((string) $payload['email']);
        $password = (string) $payload['password'];

        $user = $this->userModel->findByEmail($email);

        if ($user === null || ! password_verify($password, $user['password_hash'])) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => 'error',
                    'message' => 'Credenciales incorrectas. Verifique su correo y contraseña.',
                ]);
        }

        $token = $this->generateToken($user);

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Inicio de sesión exitoso.',
            'token'   => $token,
            'user'    => $this->sanitizeUser($user),
        ]);
    }

    public function register(): ResponseInterface
    {
        $payload = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'name'     => 'required|min_length[2]|max_length[100]',
            'email'    => 'required|valid_email|max_length[150]|is_unique[users.email]',
            'password' => 'required|min_length[6]',
        ];

        if (! $this->validateData($payload, $rules)) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_UNPROCESSABLE_ENTITY)
                ->setJSON([
                    'status'  => 'error',
                    'message' => 'No se pudo completar el registro. Revise los datos enviados.',
                    'errors'  => $this->validator->getErrors(),
                ]);
        }

        $userId = $this->userModel->insert([
            'name'          => trim((string) $payload['name']),
            'email'         => strtolower(trim((string) $payload['email'])),
            'password_hash' => password_hash((string) $payload['password'], PASSWORD_DEFAULT),
        ]);

        $user  = $this->userModel->find($userId);
        $token = $this->generateToken($user);

        return $this->response
            ->setStatusCode(ResponseInterface::HTTP_CREATED)
            ->setJSON([
                'status'  => 'success',
                'message' => 'Usuario registrado correctamente.',
                'token'   => $token,
                'user'    => $this->sanitizeUser($user),
            ]);
    }

    public function me(): ResponseInterface
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        $token      = trim(substr($authHeader, 7));
        $secret     = (string) env('JWT_SECRET', 'clave_secreta_desarrollo_ci4_react_2026_segura_32bytes!');

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userId  = (int) ($decoded->sub ?? 0);
            $user    = $this->userModel->find($userId);

            if ($user === null) {
                return $this->response
                    ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND)
                    ->setJSON([
                        'status'  => 'error',
                        'message' => 'Usuario no encontrado.',
                    ]);
            }

            return $this->response->setJSON([
                'status' => 'success',
                'user'   => $this->sanitizeUser($user),
            ]);
        } catch (Throwable $e) {
            return $this->response
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => 'error',
                    'message' => 'Sesión no válida.',
                ]);
        }
    }

    private function generateToken(array $user): string
    {
        $secret = (string) env('JWT_SECRET', 'clave_secreta_desarrollo_ci4_react_2026_segura_32bytes!');
        $ttl    = (int) env('JWT_TIME_TO_LIVE', 3600);
        $now    = time();

        $payload = [
            'iss'   => base_url(),
            'iat'   => $now,
            'exp'   => $now + $ttl,
            'sub'   => (int) $user['id'],
            'email' => $user['email'],
            'name'  => $user['name'],
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }

    private function sanitizeUser(array $user): array
    {
        return [
            'id'         => (int) $user['id'],
            'name'       => $user['name'],
            'email'      => $user['email'],
            'created_at' => $user['created_at'] ?? null,
        ];
    }
}

