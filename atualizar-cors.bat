@echo off
echo ========================================
echo   Atualizar CORS para Netlify
echo ========================================
echo.

echo [1/4] Adicionando mudancas...
git add backend/src/server.js

echo.
echo [2/4] Fazendo commit...
git commit -m "fix: Adicionar URLs do Netlify no CORS"

echo.
echo [3/4] Fazendo push...
git push

echo.
echo [4/4] Concluido!
echo.
echo ========================================
echo   CORS atualizado!
echo ========================================
echo.
echo O Render vai fazer redeploy automaticamente.
echo Aguarde 5-10 minutos para o deploy completar.
echo.
echo URLs configuradas:
echo - https://lanchonete-cliente.netlify.app
echo - https://lanchonete-painel.netlify.app
echo - http://localhost:5173
echo - http://localhost:5174
echo.
pause
