@echo off
Setlocal enabledelayedexpansion
:N
::�û�¼����ȷ��Ŀ¼����ת���������
set svnPath=D:\TortoiseSVN\bin
set exeName=TortoiseProc.exe
set projectPath=%~dp0
goto Y
:Y
echo ���ݴ�����
::ʹ��forѭ���� dir ��ȡ���ַ����л�ȡ�ļ�������
:: dir /ad-s/b ��ʾֻȡĿ¼�����Ҳ���ϵͳ�ļ��У�ʹ�ÿո�ģʽ��ʾ
for /f "delims=" %%i in ('"dir /ad-s/b "') do (
echo ���ڲ�ѯ�ļ���%%i���Ƿ����svn��Ϣ
::�ж��Ƿ���svn�ļ���
if exist "%~dp0%%i\.svn\" (
echo ���ڸ�����Ŀ %%i
::���ø�������
cd %projectPath%\%%i
svn upgrade
svn update)
)
echo �������
pause

