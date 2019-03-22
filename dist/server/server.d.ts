import express = require('express');
export default class Server {
    app: express.Application;
    port: number;
    constructor(puerto: number);
    /**
     * Inicializar la configuración del servidor
     * @param puerto Iniciar con el puerto
     */
    static init(puerto: number): Server;
    private publicDir;
    /**
     * Ejecutar servidor
     * @param callback Callback Opcional
     */
    start(callback?: Function): void;
}
