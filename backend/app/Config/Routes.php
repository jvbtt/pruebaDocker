<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api/auth', static function (RouteCollection $routes) {
    $routes->options('(:any)', static function () {
        return service('response')->setStatusCode(204);
    });
    $routes->post('login', 'Api\AuthController::login');
    $routes->post('register', 'Api\AuthController::register');
    $routes->get('me', 'Api\AuthController::me', ['filter' => 'jwt']);
});
