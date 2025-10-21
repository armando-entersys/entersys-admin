#!/usr/bin/env python3
"""
Script de despliegue para Entersys Admin Panel
Ejecutar en el servidor de producción
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, description):
    """Ejecuta un comando y muestra el resultado"""
    print(f"\n{'='*60}")
    print(f"▶️  {description}")
    print(f"{'='*60}")
    print(f"Comando: {cmd}\n")

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)

    if result.returncode != 0:
        print(f"❌ Error ejecutando: {description}")
        print(f"Código de salida: {result.returncode}")
        return False

    print(f"✅ {description} - Completado")
    return True

def main():
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║          🚀 DESPLIEGUE ENTERSYS ADMIN PANEL 🚀          ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝
    """)

    # Verificar que estamos en el directorio correcto
    if not os.path.exists('docker-compose.yml'):
        print("❌ Error: No se encontró docker-compose.yml")
        print("Por favor ejecuta este script desde el directorio /opt/entersys-admin")
        sys.exit(1)

    steps = [
        ("git status", "Verificando estado del repositorio"),
        ("git fetch origin", "Descargando cambios desde GitHub"),
        ("git pull origin master", "Actualizando código local"),
        ("docker-compose down", "Deteniendo contenedor actual"),
        ("docker-compose build --no-cache", "Construyendo nueva imagen Docker"),
        ("docker-compose up -d", "Levantando nuevo contenedor"),
        ("docker-compose ps", "Verificando estado del contenedor"),
        ("docker-compose logs --tail=50", "Mostrando logs recientes"),
    ]

    print("\n📋 Pasos a ejecutar:")
    for i, (cmd, desc) in enumerate(steps, 1):
        print(f"   {i}. {desc}")

    print("\n")
    response = input("¿Continuar con el despliegue? (s/n): ")

    if response.lower() not in ['s', 'si', 'y', 'yes']:
        print("❌ Despliegue cancelado")
        sys.exit(0)

    # Ejecutar pasos
    success = True
    for cmd, description in steps:
        if not run_command(cmd, description):
            success = False
            if "down" not in cmd and "logs" not in cmd:  # Continuar si falla down o logs
                break

    print("\n" + "="*60)
    if success:
        print("""
    ✅ ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!

    🌐 El admin panel está disponible en:
       👉 https://admin.entersys.mx

    📊 Para verificar:
       - docker-compose ps
       - docker-compose logs -f
       - curl -I https://admin.entersys.mx
        """)
    else:
        print("""
    ❌ El despliegue tuvo problemas

    🔍 Para investigar:
       - docker-compose logs
       - docker-compose ps
       - git status
        """)

    print("="*60)

if __name__ == "__main__":
    main()
