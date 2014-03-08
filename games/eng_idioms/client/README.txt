To make plugins avaliable in Construct2:
1. Run cmd.exe as Administrator (right click on cmd.exe file -> run as Administrator)
2. cd "C:\Program Files\Construct 2\exporters\html5\plugins"
3. mklink /D quest_action DEFAULT_STORAGE_GITHUB_DIRECTORY\egp-web-app\games\eng_idioms\client\quest_engine\plugins\quest_action
4. mklink /D quest_engine DEFAULT_STORAGE_GITHUB_DIRECTORY\egp-web-app\games\eng_idioms\client\quest_engine\plugins\quest_engine

5. cd "C:\Program Files\Construct 2\exporters\html5\behaviours"
6. mklink /D text_auto_resize DEFAULT_STORAGE_GITHUB_DIRECTORY\egp-web-app\games\eng_idioms\client\quest_engine\plugins\text_auto_resize

7. cd "C:\Program Files\Construct 2\exporters\html5\plugins"
8. mklink /D quest_engine DEFAULT_STORAGE_GITHUB_DIRECTORY\egp-web-app\games\eng_idioms\client\quest_engine\plugins\scml