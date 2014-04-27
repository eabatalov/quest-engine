/*
 * Order of init/deinit is strict and influenced by plugin dependencies.
 * That's why we have this enum.
 */
_SCRIPT_PLUGINS = {
    FIRST : 0,
    NOTIFICATION_CENTER : 0,
    COND_TYPE_VALIDATOR : 1,
    STAGE_SEARCH : 2,
    STORYLINE_SEARCH : 3,
    VALIDATION_BROKER : 4,
    QUEST_OBJECT_MANAGER : 5,
    LAST : 5
};
