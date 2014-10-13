ScriptEditorPropertiesWindowController = function($scope, seEventRouter, seService, $timeout) {
        //Make global constants accessible from $scope
		$scope.QUEST_PHRASE_TYPES = _QUEST_PHRASE_TYPES;
		$scope.QUEST_NODES = _QUEST_NODES;
		$scope.QUEST_CONDS = _QUEST_CONDS;
        $scope.FUNC_CALL_PARAMS = SEFuncCallNodeParameter.types;
        $scope.FUNC_SOURCES = SEFuncCallNode.sources;

        $scope.objToAddId = null;
        $scope.node = null;
        $scope.cond = null;

        this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
        this.seService = seService;
        this.condTypeValidator = function() {
            return this.seService.getSE().getScriptPlugin(_SCRIPT_PLUGINS.COND_TYPE_VALIDATOR); };
        this.condTypeListChangedEvHandler = null;
        this.condTypesCached = null;

        $scope.condTypes = function(cond) {
            if (!cond)
                return [];

            if (this.condTypesCached)
                return this.condTypesCached;

            var condTypeNames = {};
            condTypeNames[_QUEST_CONDS.NONE] = 'None';
            condTypeNames[_QUEST_CONDS.OBJECT_CLICKED] = 'Object clicked';
            condTypeNames[_QUEST_CONDS.ANSWER_1_CLICKED] = 'Answer 1 clicked';
            condTypeNames[_QUEST_CONDS.ANSWER_2_CLICKED] = 'Answer 2 clicked';
            condTypeNames[_QUEST_CONDS.ANSWER_3_CLICKED] = 'Answer 3 clicked';
            condTypeNames[_QUEST_CONDS.ANSWER_4_CLICKED] = 'Answer 4 clicked';
            condTypeNames[_QUEST_CONDS.ANSWER_OTHER_CLICKED] = 'Answer other clicked';
            condTypeNames[_QUEST_CONDS.CONTINUE] = 'Continue';
            condTypeNames[_QUEST_CONDS.DEFAULT] = 'Default';
            condTypeNames[_QUEST_CONDS.CUSTOM_EVENT] = 'Custom event';
            condTypeNames[_QUEST_CONDS.NEXT] = 'Next';

            this.condTypesCached = [];
            var typeIds = this.condTypeValidator().getValidCondTypes(cond);
            jQuery.each(typeIds, function(ix, id) {
                this.condTypesCached.push({ id : id, title : condTypeNames[id] });
            }.bind(this));
            return this.condTypesCached;
        }.bind(this);

        this.condTypeListChanged = function(cond) {
            if (!this.cond || this.cond.getId() !== cond.getId())
                return;

            this.condTypesCached = null;
            this.safeDigest();
        };

        this.safeDigest = function() {
            $timeout(function() {
                $scope.$digest();
            });
        };

        this.seEvents.on(function(args) {
            if (args.name === "OBJECT_FOCUS") {
                $scope.setPropsObject(args.obj, args.type === "NODE" );
                return;
            }

            if (args.name === "STAGE_CHANGED") {
                if (this.condTypeListChangedEvHandler)
                    this.condTypeListChangedEvHandler.delete();
                this.condTypeListChangedEvHandler =
                    this.condTypeValidator().events.validTypeListChanged.subscribe(this, this.condTypeListChanged);
                this.safeDigest();
                return;
            }
        }, this);

        $scope.addObjectToStage = function() {
            if ($scope.node.getType() === _QUEST_NODES.STAGE) {
                $scope.node.addObject($scope.objToAddId);
            }
        };

        $scope.setPropsObject = function(obj, isNode) {
            if (isNode) {
                $scope.node = obj;
                $scope.cond = null;
            } else {
                $scope.node = null;
                $scope.cond = obj;
                this.condTypesCached = null;
            }
            this.safeDigest();
        }.bind(this);

        $scope.condTypeChanged = function() {
            $scope.cond.setType($scope.cond.getType());
        };

        $scope.stageObjectPool = function(node) {
            if (!node)
                return [];

            var stage = this.seService.getSE().getScriptPlugin(_SCRIPT_PLUGINS.STAGE_SEARCH).search(node);
            if (!stage)
                return [];

            return stage.getProps().objPool;
        }.bind(this);

        $scope.addObjectToStoryLine = function() {
            if ($scope.node.getType() === _QUEST_NODES.STORYLINE) {
                var stage = this.seService.getSE().getScriptPlugin(_SCRIPT_PLUGINS.STAGE_SEARCH).search($scope.node);
                if (!stage)
                    return;
                $scope.node.addObject($scope.objToAddId, stage);
                //autoselect next avaliable object
                if (stage.getProps().objPool.length > 0)
                    $scope.objToAddId = stage.getProps().objPool[0];
            }
        }.bind(this);

        $scope.storylineObjects = function(graphObj) {
            if (!graphObj)
                return [];

            var storyline = this.seService.getSE().getScriptPlugin(_SCRIPT_PLUGINS.STORYLINE_SEARCH).search(graphObj);
            if (!storyline)
                return [];

            return storyline.getProps().objs;
        }.bind(this);

        $scope.addParam = function() {
            var params = $scope.node.getProp('params');
            params.push(new SEFuncCallNodeParameter(
                SEFuncCallNodeParameter.types.str,
                '',
                ''
            ));
        }.bind(this);

        $scope.delParam = function(paramName) {
            var params = $scope.node.getProp('params');
            jQuery.each(params, function(ix, param) {
                if (param.name === paramName) {
                    params.splice(ix, 1);
                    return false;
                }
            });
        }.bind(this);

        $scope.phraseSizes = function() {
            var sizeNameList = [];
            for (var sizeName in _QUEST_PHRASE_SIZES)
                sizeNameList.push(sizeName);
            return sizeNameList;
        };

        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "CNTRL_INIT_PROP_WIND" });
};
