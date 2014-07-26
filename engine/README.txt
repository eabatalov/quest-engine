To make plugins avaliable in Construct2:
1. Run cmd.exe as Administrator (right click on cmd.exe file -> run as Administrator)

2. cd "C:\Program Files\Construct 2\exporters\html5\plugins"
4. mklink /D quest_level_runtime QUEST_ENGINE_REPO_DIR\engine\plugins\quest_level_runtime
5. mklink /D scml QUEST_ENGINE_REPO_DIR\engine\plugins\scml
6. mklink /D quest_runtime_test QUEST_ENGINE_REPO_DIR\engine\plugins\quest_runtime_test
7. mklink /D quest_inapp_purchase QUEST_ENGINE_REPO_DIR\engine\plugins\quest_inapp_purchase
8. mklink /D quest_persistent_storage QUEST_ENGINE_REPO_DIR\engine\plugins\quest_persistent_storage
9. mklink /D quest_game_plugin QUEST_ENGINE_REPO_DIR\engine\plugins\quest_game_plugin
9. mklink /D quest_level_recording QUEST_ENGINE_REPO_DIR\engine\plugins\quest_level_recording
10. mklink /D quest_level_playback QUEST_ENGINE_REPO_DIR\engine\plugins\quest_level_playback
