ScriptEditorPropertiesWindowController = function($scope, seEvents, scriptEditor) {
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
        $scope.objToAdd = null;
        $scope.node = null;
        $scope.cond = null;

        $scope.$on('seEvent', function() {
            $scope.$apply(function() {
                if (seEvents.args.name === "NODE_PROP_EDIT") {
                    $scope.setPropsObject(seEvents.args.obj, true);
                } else if (seEvents.args.name === "COND_PROP_EDIT") {
                    $scope.setPropsObject(seEvents.args.obj, false);
                } else if (seEvents.args.name === "NODE_CREATE") {
                    var scriptAreaGlobalXY = new PIXI.Point(0, 0);
                    scriptAreaGlobalXY.x =
                        scriptEditor.panels.script.position.x;
                    scriptAreaGlobalXY.y =
                        scriptEditor.panels.script.position.y;
                    var newNodePoint = new PIXI.Point(
                        seEvents.args.targetPointGlobal.x - scriptAreaGlobalXY.x,
                        seEvents.args.targetPointGlobal.y - scriptAreaGlobalXY.y
                    );
                    if (newNodePoint. x < 0 || newNodePoint.y < 0) {
                        return;
                    }
                    var newNode = new SENode(seEvents, seEvents.args.type);
                    newNode.position = newNodePoint;
                    scriptEditor.treeEditor.addChild(newNode);
                    scriptEditor.treeEditor.nodes.all.push(newNode);
                    $scope.setPropsObject(newNode, true);
                    scriptEditor.updateStage();
                }
            });
        });

        $scope.addObjectToStoryLine = function() {
            $scope.node.props.objs.push($scope.objToAdd);
            scriptEditor.nodes.stages[0].props.objPool.remove($scope.objToAdd);
        };

        $scope.addObjectToStage = function() {
            $scope.node.props.objs.push($scope.objToAdd);
            $scope.node.props.objPool.push($scope.objToAdd);
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