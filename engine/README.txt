To make plugins avaliable in Construct2:
1. Run cmd.exe as Administrator (right click on cmd.exe file -> run as Administrator)

2. cd "C:\Program Files\Construct 2\exporters\html5\plugins"
3. mklink /D quest_runtime_interface REPO_DIR\engine\plugins\quest_runtime_interface
4. mklink /D quest_runtime REPO_DIR\engine\plugins\quest_runtime
5. mklink /D scml REPO_DIR\engine\plugins\scml
6. mklink /D quest_runtime_test REPO_DIR\engine\plugins\quest_runtime_test