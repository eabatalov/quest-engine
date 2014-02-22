ScriptEditorPropertiesWindowController = function($scope, seEvents) {
        //Make constants accessible from ng attributes
        $scope._QUEST_NODE_STAGE = _QUEST_NODE_STAGE;
        $scope._QUEST_NODE_STORYLINE = _QUEST_NODE_STORYLINE;

        $scope.condTypes = [
            { id: _QUEST_COND_NONE, title: 'None'},
            { id: _QUEST_COND_OBJECT_CLICKED, title: 'Object clicked'},
            { id: _QUEST_COND_ANSWER_1_CLICKED, title: 'Answer 1 clicked'},
            { id: _QUEST_COND_ANSWER_2_CLICKED, title: 'Answer 2 clicked'},
            { id: _QUEST_COND_ANSWER_3_CLICKED, title: 'Answer 3 clicked'},
            { id: _QUEST_COND_ANSWER_4_CLICKED, title: 'Answer 4 clicked'},
            { id: _QUEST_COND_ANSWER_OTHER_CLICKED, title: 'Answer other clicked'},
            { id: _QUEST_COND_CONTINUE, title: 'Continue'},
            { id: _QUEST_COND_DEFAULT, title: 'Default'}
        ];
        $scope.objToAddId = null;
        $scope.node = null;
        $scope.cond = null;

        $scope.$on('seEvent', function() {
            $scope.$apply(function() {
                if (seEvents.args.name === "NODE_PROP_EDIT") {
                    $scope.setPropsObject(seEvents.args.obj, true);
                } else if (seEvents.args.name === "COND_PROP_EDIT") {
                    $scope.setPropsObject(seEvents.args.obj, false);
                }
            });
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
    };