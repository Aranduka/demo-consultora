-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMIN', 'CLIENTE') NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `debeCambiarClave` BOOLEAN NOT NULL DEFAULT true,
    `ultimoAcceso` DATETIME(3) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clientes_usuarioId_key`(`usuarioId`),
    UNIQUE INDEX `clientes_documento_key`(`documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias_servicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `categorias_servicio_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoriaId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(12, 2) NOT NULL,
    `moneda` VARCHAR(191) NOT NULL DEFAULT 'PYG',
    `periodicidad` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `encargados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `franjas_horarias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etiqueta` VARCHAR(191) NOT NULL,
    `horaInicio` VARCHAR(191) NOT NULL,
    `horaFin` VARCHAR(191) NOT NULL,
    `cupo` INTEGER NOT NULL DEFAULT 5,
    `activa` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `franjaId` INTEGER NOT NULL,
    `encargadoId` INTEGER NULL,
    `fecha` DATE NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `observaciones` TEXT NULL,
    `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `visitas_fecha_estado_idx`(`fecha`, `estado`),
    INDEX `visitas_clienteId_idx`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias_servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visitas` ADD CONSTRAINT `visitas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visitas` ADD CONSTRAINT `visitas_franjaId_fkey` FOREIGN KEY (`franjaId`) REFERENCES `franjas_horarias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visitas` ADD CONSTRAINT `visitas_encargadoId_fkey` FOREIGN KEY (`encargadoId`) REFERENCES `encargados`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
