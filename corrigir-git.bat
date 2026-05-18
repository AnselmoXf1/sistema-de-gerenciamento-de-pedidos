@echo off
echo ========================================
echo   Corrigir Problema Git Submodules
echo ========================================
echo.

REM Verificar se está na pasta correta
if not exist "backend" (
    echo ERRO: Pasta backend nao encontrada!
    echo Execute este script na raiz do projeto.
    pause
    exit /b 1
)

echo [1/8] Removendo .gitmodules se existir...
if exist .gitmodules (
    del /F .gitmodules
    echo .gitmodules removido
) else (
    echo .gitmodules nao existe
)

echo.
echo [2/8] Removendo cache do git...
git rm -r --cached frontend 2>nul
git rm -r --cached . 2>nul

echo.
echo [3/8] Adicionando todos os arquivos novamente...
git add .

echo.
echo [4/8] Verificando status...
git status

echo.
echo [5/8] Fazendo commit...
git commit -m "fix: Remover submodules e corrigir estrutura"

echo.
echo [6/8] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git

echo.
echo [7/8] Verificando branch...
git branch -M main

echo.
echo [8/8] Fazendo push forcado...
git push -u origin main --force

echo.
echo ========================================
echo   Correcao concluida!
echo ========================================
echo.
echo Agora tente fazer deploy novamente no Netlify
echo.
pause
