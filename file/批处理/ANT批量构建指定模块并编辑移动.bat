@ECHO OFF
ECHO ========================================
ECHO      �Զ�������ʼ�ˣ�
ECHO =========================================

set thePath=%~dp0
::AIMS
cd  %thePath%\AIMS-code-N0801
call svn update
call ant build.g6
::GDEBIT
cd  %thePath%\GDEBIT-N0801
call svn update
call ant build.g6.oracle


pause

