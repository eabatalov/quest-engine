ScriptEditorPropertiesWindowController = function($scope, seEvents, $timeout) {
        //Make global constants accessible from $scope
        $scope.PLAYER_ACTIONS = _PLAYER_ACTIONS;
		$scope.UI_ACTIONS = _UI_ACTIONS;
		$scope.UI_ACTORS = _UI_ACTORS;
		$scope.UI_PHRASE_TYPES = _UI_PHRASE_TYPES;
		$scope.QUEST_NODES = _QUEST_NODES;
		$scope.QUEST_CONDS = _QUEST_CONDS;

        $scope.condTypes = [
            { id: _QUEST_CONDS.NONE, title: 'None'},
            { id: _QUEST_CONDS.OBJECT_CLICKED, title: 'Object clicked'},
            { id: _QUEST_CONDS.ANSWER_1_CLICKED, title: 'Answer 1 clicked'},
            { id: _QUEST_CONDS.ANSWER_2_CLICKED, title: 'Answer 2 clicked'},
            { id: _QUEST_CONDS.ANSWER_3_CLICKED, title: 'Answer 3 clicked'},
            { id: _QUEST_CONDS.ANSWER_4_CLICKED, title: 'Answer 4 clicked'},
            { id: _QUEST_CONDS.ANSWER_OTHER_CLICKED, title: 'Answer other clicked'},
            { id: _QUEST_CONDS.CONTINUE, title: 'Continue'},
            { id: _QUEST_CONDS.DEFAULT, title: 'Default'}
        ];
        $scope.objToAddId = null;
        $scope.node = null;
        $scope.cond = null;

        seEvents.on(function(args) {
            if (args.name === "OBJECT_FOCUS") {
                $timeout(function() {
                    //Safe digest
                    $scope.$apply(function() { $scope.setPropsObject(args.obj, args.type === "NODE" ); });
                });
            }
        });

        $scope.addObjectToStoryLine = function() {
            $scope.node.methods.addObject($scope.objToAddId);
        };

        $scope.addObjectToStage = function() {
            $scope.node.methods.addObject($scope.objToAddId);
        };

        $scope.setPropsObject = function(obj, isNode) {
            if (isNode) {
                $scope.node = obj;
                $scope.cond = null;
            } else {
                $scope.node = null;
                $scope.cond = obj;                            
            }
        };

        $scope.condTypeChanged = function() {
            $scope.cond.changeType($scope.cond.type);
        };

        $scope.initialized = function() {
            $scope.$emit("PROPS_WIND_INITED");
        };
    };
