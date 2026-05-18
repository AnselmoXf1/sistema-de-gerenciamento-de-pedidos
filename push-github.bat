@echo off
echo ========================================
echo   Push para GitHub
echo ========================================
echo.

REM Verificar se está na pasta correta
if not exist "backend" (
    echo ERRO: Pasta backend nao encontrada!
    echo Certifique-se de estar na raiz do projeto.
    pause
    exit /b 1
)

echo [1/6] Verificando status...
git status

echo.
echo [2/6] Adicionando arquivos...
git add .

echo.
echo [3/6] Fazendo commit...
git commit -m "feat: Sistema completo - Scanner QR, Links Unicos e Deploy configs"

echo.
echo [4/6] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git

echo.
echo [5/6] Verificando branch...
git branch -M main

echo.
echo [6/6] Fazendo push...
git push -u origin main --force

echo.
echo ========================================
echo   Push concluido!
echo ========================================
echo.
echo Verifique em: https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos
echo.
pause
