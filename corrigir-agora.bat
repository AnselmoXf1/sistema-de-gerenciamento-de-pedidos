@echo off
echo ========================================
echo   Corrigir Git Embedded Repository
echo ========================================
echo.

echo [1/10] Removendo .git da pasta frontend...
if exist frontend\.git (
    rmdir /s /q frontend\.git
    echo .git removido de frontend
) else (
    echo frontend\.git nao existe
)

echo.
echo [2/10] Removendo .git da pasta frontend\cliente...
if exist frontend\cliente\.git (
    rmdir /s /q frontend\cliente\.git
    echo .git removido de frontend\cliente
) else (
    echo frontend\cliente\.git nao existe
)

echo.
echo [3/10] Removendo .git da pasta frontend\painel...
if exist frontend\painel\.git (
    rmdir /s /q frontend\painel\.git
    echo .git removido de frontend\painel
) else (
    echo frontend\painel\.git nao existe
)

echo.
echo [4/10] Removendo cache do git...
git rm -r --cached frontend

echo.
echo [5/10] Adicionando frontend novamente...
git add frontend

echo.
echo [6/10] Adicionando todos os outros arquivos...
git add .

echo.
echo [7/10] Verificando status...
git status

echo.
echo [8/10] Fazendo commit...
git commit -m "fix: Remover repositorios git embedded e corrigir estrutura"

echo.
echo [9/10] Verificando branch...
git branch -M main

echo.
echo [10/10] Fazendo push forcado...
git push -u origin main --force

echo.
echo ========================================
echo   Correcao concluida!
echo ========================================
echo.
echo Verifique no GitHub: https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos
echo Agora pode fazer deploy no Netlify!
echo.
pause
