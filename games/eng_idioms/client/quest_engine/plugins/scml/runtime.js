// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Spriter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Spriter.prototype;
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
		this.scmlFiles=[];
		this.objectArrays=[];
	};

	/////////////////////////////////////
	// Instance class

	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		this.lastData = "";		
		this.progress = 0;
		
		this.entity = 0;
		this.entities = [];
		
		this.currentSpriterTime = 0;
		this.start_time = cr.performance_now();
		this.lastKnownTime = this.getNowTime();
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.setEntitiesToOtherEntities = function(otherEntities)
	{
		var NO_INDEX=-1;
		var entityTags = otherEntities;
		var att=0;
		for (var e = 0; e < entityTags.length; e++)
		{
			var entityTag=entityTags[e];
			att=entityTag;
			var entity = new SpriterEntity();
			att=entityTag;
			entity.name=att.name;
			var animationTags = entityTag.animations;
			for (var a = 0; a < animationTags.length; a++)
			{
				var animationTag = animationTags[a];
				att=animationTag;
				var animation = new SpriterAnimation();
				animation.name=att.name;
				animation.length=att.length;
				animation.looping = att.looping;
				animation.loopTo = att.loop_to;
				
				var mainlineTag = animationTag.mainlineKeys;
				
				var mainline = new SpriterTimeline();
				
				
				var keyTags = mainlineTag;		
				for (var k = 0; k<keyTags.length; k++)
				{
					var keyTag = keyTags[k];
					
					var key = new SpriterKey();
					att=keyTag;
					key.time = att.time;
					
					var boneRefTags = keyTag.bones;	
					if(boneRefTags)
					{
						for (var o = 0; o < boneRefTags.length; o++)
						{
							var boneRefTag=boneRefTags[o];
							att=boneRefTag;
							var boneRef = new SpriterObjectRef();
							boneRef.timeline=att.timeline;
							boneRef.key=att.key;
							boneRef.parent = att.parent;
							key.bones.push(boneRef);
						}		
					}
					
					var objectRefTags = keyTag.objects;	
					if(objectRefTags)
					{
						for (var o = 0; o < objectRefTags.length; o++)
						{
							var objectRefTag=objectRefTags[o];
							att=objectRefTag;
							var objectRef = new SpriterObjectRef();
							objectRef.timeline=att.timeline;
							objectRef.key=att.key;
							objectRef.parent = att.parent;
							key.objects.push(objectRef);
						}		
					}
					
					animation.mainlineKeys.push(key);
				}	
				
				animation.mainline=mainline;
				var timelineTags = animationTag.timelines;
				if(timelineTags)
				{
					for (var t = 0; t < timelineTags.length; t++)
					{
						var timelineTag=timelineTags[t];
						
						att=timelineTag;
						
						var timeline = new SpriterTimeline();
						timeline.objectType = att.objectType;
						
						var timelineName=att.name;
						timeline.name=timelineName;
						
						var keyTags = timelineTag.keys;		
						if(keyTags)
						{
							
							for (var k = 0; k<keyTags.length; k++)
							{
								var keyTag = keyTags[k];
								
								var key = new SpriterKey();
								att=keyTag;
								
								key.time = att.time;
								key.spin = (att.spin);
								
								var objectTags = keyTag.objects;
								if(objectTags)
								{
									for(var o=0; o<objectTags.length; o++)
									{			
										var objectTag=objectTags[o];
										var object=CloneObject(objectTag);
										key.objects.push(object);
									}
								}
								var boneTags = keyTag.bones;
								if(boneTags)
								{
									for(var o=0; o<boneTags.length; o++)
									{			
										var boneTag=boneTags[o];
										var bone=CloneObject(boneTag);
										key.bones.push(bone);
									}
								}
								timeline.keys.push(key);
							}		
						}
						timeline.c2Object=this.c2ObjectArray[findObjectItemInArray(timelineName,this.objectArray)];
						animation.timelines.push(timeline);
					}
				}
				entity.animations.push(animation);

			}
			this.entities.push(entity);
			if(!this.entity||this.properties[1]===entity.name)
			{
				this.entity=entity;
			}
		}
		
		
	}
	instanceProto.onCreate = function()
	{
		this.scaleRatio=this.width/50.0;
		this.xmlDoc = null;
		this.nodeStack = [];
		this.cur_frame = 0;
		this.folders = [];
		this.currentAnimation = "";
		this.lastKnownInstDataAsObj = null;
		this.c2ObjectArray = [];
		this.objectArray=[];
		this.animPlaying = false;
		this.speedRatio=1.0;
		this.scaleRatio=1.0;
		this.xFlip=false;
		this.yFlip=false;
		this.playTo=-1;
		this.changeToStartFrom=0;
		this.runtime.tickMe(this);
		this.startingEntName=null;
		this.startingAnimName=null;
		this.startingLoopType=null;
		
		this.properties[0]=this.properties[0].toLowerCase();
		if(this.properties[0].lastIndexOf(".scml")>-1)
		{
			this.properties[0]=this.properties[0].replace(".scml",".scon");
		}
		if(this.type.scmlFiles.hasOwnProperty(this.properties[0]))
		{	
			this.setEntitiesToOtherEntities(this.type.scmlFiles[this.properties[0]]);
			if(this.type.objectArrays.hasOwnProperty(this.properties[0]))
			{
				this.objectArray=this.type.objectArrays[this.properties[0]];
			}
			
			this.c2ObjectArray=this.generateTestC2ObjectArray(this.objectArray);
			
			if(this.startingEntName)
			{
				this.setEntTo(this.startingEntName);
			}
			else
			{
				this.setEntTo(this.properties[1]);
			}
			
			this.associateAllTypes();
			this.initDOMtoPairedObjects();
			
			if(this.startingAnimName)
			{
				this.setAnimTo(this.startingAnimName);
			}
			else
			{
				this.setAnimTo(this.properties[2]);
			}	
			
			if(!this.currentAnimation&&this.entity&&this.entity.animations.length)
			{
				this.setAnimTo(entity.animations[0].name);
			}	
			if(this.startingLoopType&&this.currentAnimation)
			{
				this.currentAnimation.looping=startingLoopType;
			}
		}
		else
		{
			var self=this;
			var request = null;
			
			var doErrorFunc = function ()
			{
				
			};
			
			var errorFunc = function ()
			{
				
			};
			
			var progressFunc = function (e)
			{
				
			};
			
			request = new XMLHttpRequest();
			var isNodeWebkit=this.runtime.isNodeWebkit;
			request.onreadystatechange = function() 
			{
				// Note: node-webkit leaves status as 0 for local AJAX requests, presumably because
				// they are local requests and don't have a HTTP response.  So interpret 0 as success
				// in this case.
				
				if (request.readyState === 4 && (isNodeWebkit || request.status !== 0))
				{
					if (request.status >= 400)
					{
						//on_Error;
					}
					else
					{
						request.responseText.replace(/\r\n/g, "\n");// fix windows style line endings
						self.doRequest(JSON.parse(request.responseText));		
						if(self.startingEntName)
						{
							self.setEntTo(self.startingEntName);
						}
						
						if(self.startingAnimName)
						{
							self.setAnimTo(self.startingAnimName);
						}
						if(self.startingLoopType&&self.currentAnimation)
						{
							self.currentAnimation.looping=self.startingLoopType;
						}
					}
				}
			};
			request.onerror = errorFunc;
			request.ontimeout = errorFunc;
			request.onabort = errorFunc;
			request["onprogress"] = progressFunc;
			
			request.open("GET", this.properties[0]);
			request.send();

			
		}
		
		
		this.force=false;
		this.inAnimTrigger=false;
		this.changeAnimTo=null;
	};
	
	function SpriterEntity()
	{
		this.name = "";
		this.animations = [];
	}
	
	function SpriterAnimation()
	{
		this.name = "";
		this.length = 1;
		this.looping = "true";
		this.loopTo = 0;
		this.mainlineKeys = [];
		this.timelines = [];
	}
	
	function SpriterTimeline()
	{
		this.keys = [];
		this.name = "";
		this.c2Object = 0;
		this.objectType="sprite";
	}
	
	function SpriterKey()
	{
		this.bones = [];
		this.objects = [];
		this.time = 0;
		this.spin = 1;
	}
	
	function SpriterObject()
	{
		this.type = "sprite";
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.a = 1;
		this.xScale = 1;
		this.yScale = 1;
		this.pivotX = 0;
		this.pivotY = 0;
		this.frame = 0;
		this.storedFrame = 0;
	}
	
	function CloneObject(other)
	{
		if(other)
		{
			var newObj=new SpriterObject();
			newObj.type = other.type;
			newObj.x = other.x;
			newObj.y = other.y;
			newObj.angle = other.angle;
			newObj.a = other.a;
			newObj.xScale = other.xScale;
			newObj.yScale = other.yScale;
			newObj.pivotX = other.pivotX;
			newObj.pivotY = other.pivotY;
			newObj.frame = other.frame; 
			newObj.storedFrame = newObj.storedFrame;
			return newObj;
		}
		else
		{
			return null;
		}
	}
	
	function TweenedSpriterObject(a,b,t,spin,wFactor,hFactor)
	{
		wFactor = typeof wFactor !== 'undefined' ? wFactor : 1;
		hFactor = typeof hFactor !== 'undefined' ? hFactor : 1;
		var newObj=new SpriterObject();
		newObj.type = a.type;
		newObj.x = cr.lerp(a.x,b.x,t);
		newObj.y = cr.lerp(a.y,b.y,t);
		newObj.angle = anglelerp2(a.angle,b.angle,t,spin);
		newObj.a = cr.lerp(a.a,b.a,t);
		newObj.xScale = cr.lerp(a.xScale,b.xScale,t);
		newObj.yScale = cr.lerp(a.yScale,b.yScale,t);
		newObj.pivotX = a.pivotX;//cr.lerp(a.pivotX,b.pivotX,t);
		newObj.pivotY = a.pivotY;//cr.lerp(a.pivotY,b.pivotY,t);
		newObj.frame = a.frame;
		newObj.storedFrame=a.storedFrame;
		return newObj;
	}
	
	function SpriterObjectRef()
	{
		this.type = "reference";
		this.timeline = 0;
		this.key = 0;
		this.parent = -1;
	}
	
	function SpriterFolder()
	{
		this.files = [];
	}
	
	function SpriterFile()
	{
		this.fileName="";
		this.pivotX=0;
		this.pivotY=0;	
	}
	
	function SetSpriteAnimFrame(sprite,framenumber)
	{
		if(!sprite)
		{
			return;
		}
		sprite.changeAnimFrame = framenumber;
		
		// start ticking if not already
		if (!sprite.isTicking)
		{
			sprite.runtime.tickMe(sprite);
			sprite.isTicking = true;
		}
		
		// not in trigger: apply immediately
		if (!sprite.inAnimTrigger)
		{
			sprite.doChangeAnimFrame();
		}
	};
	
	function anglelerp(a, b, x)
	{
		//a = cr.to_radians(a);
		//b = cr.to_radians(b);
		var diff = cr.angleDiff(a, b);
		
		// b clockwise from a
		if (cr.angleClockwise(b, a))
		{
			return (a + diff * x);
		}
		// b anticlockwise from a
		else
		{
			return (a - diff * x);
		}
	};
	function anglelerp2(a, b, x, spin)
	{
		//a = cr.to_radians(a);
		//b = cr.to_radians(b);
		if(spin==0)
		{
			return a;
		}
		var diff = cr.angleDiff(a, b);
		
		// b clockwise from a
		if (spin==-1)
		{
			return (a + diff * x);
		}
		// b anticlockwise from a
		else 
		{
			return (a - diff * x);
		}
	};
	instanceProto.MoveToLayer = function (inst,layerMove)
	{
		// no layer or same layer: don't do anything
		if (!layerMove || layerMove == inst.layer)
		return;
		
		// otherwise remove from current layer...
		cr.arrayRemove(inst.layer.instances, inst.get_zindex());
		inst.layer.zindices_stale = true;
		
		// ...and add to the top of the new layer (which can be done without making zindices stale)
		inst.layer = layerMove;
		inst.zindex = layerMove.instances.length;
		layerMove.instances.push(inst);
		
		inst.runtime.redraw = true;
	};
	
	instanceProto.animationFinish = function (reverse)
	{
		this.animTriggerName = this.currentAnimation.name;
		var animTrigger=this.inAnimTrigger;
		if(this.inAnimTrigger==false)
		{
			this.inAnimTrigger = true;
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnAnyAnimFinished, this);
			this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnAnimFinished, this);
			this.inAnimTrigger = false;
		}
	};
	
	instanceProto.getNowTime = function()
	{
		return (cr.performance_now() - this.start_time) / 1000.0;
	};
	
	instanceProto.doAnimChange = function()
	{
		if(this.currentAnimation)
		{
			var ratio=this.currentSpriterTime/this.currentAnimation.length;
		}
		this.currentAnimation=this.changeAnimTo;
		
		this.changeAnimTo=null;
		var startFrom=this.changeToStartFrom;
		var animanim=this.currentAnimation.name;
		if(startFrom==0)
		{
			if(this.speedRatio>0)
			{
				this.currentSpriterTime=0;				
			}
			else
			{
				this.currentSpriterTime=this.currentAnimation.length;				
			}
			this.lastKnownTime=this.getNowTime();
		}
		else if (startFrom==2)
		{
			this.currentSpriterTime=this.currentAnimation.length*ratio;
			this.lastKnownTime=this.getNowTime();
		}		
	};
	instanceProto.tickCurrentAnimationTime = function()
	{
		var lastKnownTime=this.lastKnownTime;
		this.lastKnownTime=this.getNowTime();	
		var lastSpriterTime=this.currentSpriterTime;
		var cur_timescale=this.runtime.timescale;
		var animation=this.currentAnimation;
		// Apply object's own time scale if any
		if (this.my_timescale !== -1.0)
		{
			cur_timescale=this.my_timescale;
		}
		if(this.animPlaying)
		{
			this.currentSpriterTime+=(this.getNowTime()-lastKnownTime)*1000*this.speedRatio*cur_timescale;
		}
		var playTo=this.playTo;
		var animFinished=false;
		if(playTo>=0)
		{	
			if(this.animPlaying)
			{
				if(((lastSpriterTime-playTo)*(this.currentSpriterTime-playTo))<0)
				{
					this.animPlaying=false;
					this.currentSpriterTime=this.playTo;
					this.playTo=-1;
					animFinished=true;
					
				}
			}
		}
		else
		{
			if(this.speedRatio>=0)
			{
				if(this.currentSpriterTime>=animation.length)
				{
					if(animation.looping=="false")
					{
						this.currentSpriterTime=animation.length;
						this.animPlaying=false;
					}
					animFinished=true;
				}
			}
			else
			{
				if(this.speedRatio<0)
				{
					if(this.currentSpriterTime<0)
					{
						if(animation.looping=="false")
						{
							this.currentSpriterTime=0;
							this.animPlaying=false;
						}
						animFinished=true;
					}
				}
			}
		}
		
		while(this.currentSpriterTime<0)
		{
			this.currentSpriterTime+=animation.length;
		}
		
		if(this.currentSpriterTime!==animation.length)
		{
			this.currentSpriterTime%=animation.length;	
		}
		return animFinished;
	};
	instanceProto.setMainlineKeyByTime = function()
	{
		var animation=this.currentAnimation;
		if(animation)
		{
			var mainKeys=animation.mainlineKeys;
			this.cur_frame=mainKeys.length;
			for (var k=1;k<mainKeys.length;k++)
			{
				if (this.currentSpriterTime < mainKeys[k].time)
				{
					this.cur_frame = k - 1;
					break;
				}
			}
		}
	};
	instanceProto.currentTweenedBones = function()
	{
		var tweenedBones = [];
		var animation=this.currentAnimation;
		var key = animation.mainlineKeys[this.cur_frame];
		var nextTime = 0;
		for(var i = 0; i < key.bones.length; i++)
		{		
			var bone = key.bones[i];
			var nextBone = null;
			var nextFrame = null;
			var timelineIndex;
			var parent=bone.parent;
			if (bone.type == "reference")
			{
				
				var refTimeline = animation.timelines[bone.timeline];
				var namename=refTimeline.name;
				timelineIndex=bone.timeline;
				var refKey = refTimeline.keys[bone.key];
				var refKeyIndex = bone.key;
				lastTime = refKey.time;
				var nextFrame = null;
				var keysLength = refTimeline.keys.length;
				bone = refKey.bones[0];
				
				if(keysLength>1)
				{
					if(refKeyIndex+1>=keysLength&&animation.looping=="true")
					{
						nextFrame=refTimeline.keys[0];
						nextTime=nextFrame.time;
						if(this.currentSpriterTime>lastTime)
						{
							nextTime+=animation.length;
						}
						nextBone=nextFrame.bones[0];
					}
					else if(refKeyIndex+1<keysLength)
					{
						nextFrame=refTimeline.keys[refKeyIndex+1];
						nextTime=nextFrame.time;	
						nextBone=nextFrame.bones[0];
					}
				}
				var mirror_factor = (this.xFlip == 1 ? -1 : 1);
				var flip_factor = (this.yFlip == 1 ? -1 : 1);
				if(nextBone)
				{
					var lastTime=refKey.time;
					var t=0;
					if(this.currentSpriterTime<lastTime)
					{
						lastTime-=animation.length;
					}
					if(nextTime>lastTime)
					{
						t=(this.currentSpriterTime-lastTime)/(nextTime-lastTime);
					}
					

					tweenedBones[i]=TweenedSpriterObject(bone,nextBone,t,refKey.spin);
					if(parent>-1)
					{
						var flipMe=tweenedBones[parent].xScale*tweenedBones[parent].yScale;
						tweenedBones[i]=this.mapObjToObj(tweenedBones[parent],tweenedBones[i],flipMe);
					}
					else
					{
						tweenedBones[i].x*=mirror_factor*this.scaleRatio;			
						tweenedBones[i].y*=flip_factor*this.scaleRatio;
						tweenedBones[i].xScale*=mirror_factor*this.scaleRatio;
						tweenedBones[i].yScale*=flip_factor*this.scaleRatio;
						tweenedBones[i]=this.mapObjToObj(this.objFromInst(this),tweenedBones[i],mirror_factor*
						flip_factor);
					}
					
				}
				else
				{
					tweenedBones[i]=CloneObject(bone);
					if(parent>-1)
					{
						var flipMe=tweenedBones[parent].xScale*tweenedBones[parent].yScale;
						tweenedBones[i]=this.mapObjToObj(tweenedBones[parent],tweenedBones[i],flipMe);
					}
					else
					{
						tweenedBones[i].x*=mirror_factor*this.scaleRatio;			
						tweenedBones[i].y*=flip_factor*this.scaleRatio;
						tweenedBones[i].xScale*=mirror_factor*this.scaleRatio;
						tweenedBones[i].yScale*=flip_factor*this.scaleRatio;
						tweenedBones[i]=this.mapObjToObj(this.objFromInst(this),tweenedBones[i],mirror_factor*
						flip_factor);
					}
				}
				
			}
		}
		return tweenedBones;
	};
	
	instanceProto.tick = function()
	{
		if(this.changeAnimTo&&!this.inAnimTrigger)
		{
			this.doAnimChange();
		}
		
		var animation = this.currentAnimation;		
		if (!animation||this.inAnimTrigger)
		{
			return;
		}
		
		var changed=null;
		if(!this.animPlaying)
		{
			if(!this.lastKnownInstDataAsObj||!this.instsEqual(this.lastKnownInstDataAsObj,this))
			{
				changed=true;
				this.lastKnownInstDataAsObj=this.objFromInst(this);
			}
		}
		
		if(!changed&&this.force)
		{
			changed=true;
		}
		
		this.force=false;
		
		if (this.animPlaying||changed)
		{			
			var animFinished=this.tickCurrentAnimationTime();			
			if(animFinished)
			{
				this.animationFinish(this.speedRatio<0);
				if(this.changeAnimTo&&!this.inAnimTrigger)
				{
					this.tick();
					return;
				}
			}
		}
		else
		{
			return;
		}
		
		var c2ObjectArray=this.c2ObjectArray;
		this.setAllCollisionsAndVisibility(false);
		this.setMainlineKeyByTime();
		
		// Don't go out of bounds
		if (this.cur_frame < 0)
		{
			this.cur_frame = 0;
		}
		else if (this.cur_frame >= animation.mainlineKeys.length)
		{
			this.cur_frame = animation.mainlineKeys.length - 1;
		}
		
		this.runtime.redraw = true;
		
		
		
		var animation = animation;
		
		if (!animation.mainlineKeys[this.cur_frame])
		{
			return;
		}
		
		
		var tweenedBones = this.currentTweenedBones();
		

		this.animateCharacter(tweenedBones);
	};
	instanceProto.animateCharacter = function(tweenedBones)
	{
		var cur_frame = this.cur_frame;
		var object;
		var objectRef;
		var nextObject = null;
		var lastTime = 0;
		var	nextTime = 0;
		var myx = 0;
		var myy = 0;
		var w = 0;
		var h = 0;
		var layer=this.layer;
		var zIndex=layer.instances.indexOf(this);
		
		var entity = this.entity;
		var animation=this.currentAnimation;
		var key = animation.mainlineKeys[this.cur_frame];
		var refKey;
		var instances=layer.instances;
		for(var i = 0; i < key.objects.length; i++)
		{		
			object = key.objects[i];
			objectRef= key.objects[i];
			nextObject = null;
			var nextFrame = null;
			var timelineIndex;
			if (object.type == "reference")
			{
				var refTimeline = animation.timelines[object.timeline];
				timelineIndex=object.timeline;
				refKey = refTimeline.keys[object.key];
				var refKeyIndex = object.key;
				lastTime = refKey.time;
				var nextFrame = null;
				var keysLength = refTimeline.keys.length;
				object = refKey.objects[0];
				
				if(keysLength>1)
				{
					if(refKeyIndex+1>=keysLength&&animation.looping=="true")
					{
						nextFrame=refTimeline.keys[0];
						nextTime=nextFrame.time;
						if(this.currentSpriterTime>lastTime)
						{
							nextTime+=animation.length;
						}
						nextObject=nextFrame.objects[0];
					}
					else if(refKeyIndex+1<keysLength)
					{
						nextFrame=refTimeline.keys[refKeyIndex+1];
						nextTime=nextFrame.time;	
						nextObject=nextFrame.objects[0];
					}
				}
			}
			
			
			myx = this.x;			
			myy = this.y;	
			
			
			var c2Obj=refTimeline.c2Object;
			if(c2Obj)
			{
				var inst=c2Obj.inst;
				if(inst)
				{
					inst.collisionsEnabled = true;
					inst.visible=true;
					this.MoveToLayer(inst,this.layer);
					SetSpriteAnimFrame(inst,object.frame);
					
					var tweenedObj=null;
					if(nextObject)
					{
						var t=0;
						if(this.currentSpriterTime<lastTime)
					{
						lastTime-=animation.length;
					}
						if((nextTime-lastTime)>0)
						{
							t=(this.currentSpriterTime-lastTime)/(nextTime-lastTime);
						}
						tweenedObj=TweenedSpriterObject(object,nextObject,t,refKey.spin);							
					}
					else
					{
						tweenedObj=CloneObject(object);	
					}
					var cur_frame = inst.curFrame;
					var mirror_factor = (this.xFlip == 1 ? -1 : 1);
					var flip_factor = (this.yFlip == 1 ? -1 : 1);
					
					var parent=objectRef.parent;
					if(parent>-1)
					{
						tweenedObj=this.mapObjToObj(tweenedBones[parent],tweenedObj,tweenedBones[parent].xScale*
						tweenedBones[parent].yScale);
						tweenedObj.xScale*=mirror_factor;
						tweenedObj.yScale*=flip_factor;
						this.applyObjToInst(tweenedObj,inst,true);
					}
					else
					{
						tweenedObj.x*=mirror_factor*this.scaleRatio;			
						tweenedObj.y*=flip_factor*this.scaleRatio;	
						tweenedObj=this.mapObjToObj(this.objFromInst(this),tweenedObj,mirror_factor*flip_factor);
						this.applyObjToInst(tweenedObj,inst);
					}
					
					var instZOrder=zIndex+i+1;
					if(instances[instZOrder]!==inst)
					{
						var currInstanceZ=instances.indexOf(inst);
						instances.splice(currInstanceZ,1);
						instances.splice(instZOrder,0,inst);
					}
				}
			}
		}
	}
	instanceProto.draw = function (ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};
	
	function findObjectItemInArray(name, objectArray)
	{
		for (var o = 0; o < objectArray.length; o++)
		{
			if (objectArray[o].name === name)
			return o;
		}
		
		return -1;
	}

	function SpriterObjectArrayItem(spritername, name)
	{
		this.name = name;
		this.fullTypeName = spritername + "_" + name;
		this.frames = [];
	}

	instanceProto.findSprites = function(xml) //XMLDocument object, name of entityToLoad
	{
		if(!xml)
		{
			return;
		}
		
		var thisTypeName = this.type.name;
		var att;
		
		var json = xml;//.spriter_data")[0];
		var folderTags = json.folder;
		for (var d=0;d<folderTags.length;d++)
		{	
			var folderTag=folderTags[d];
			this.folders.push(new SpriterFolder());
			var fileTags = folderTag.file;			
			
			for (var f=0;f<fileTags.length;f++)
			{	
				var fileTag=fileTags[f];
				att=fileTag
				
				var spriterFile=new SpriterFile();
				spriterFile.fileName=att.name;
				if(fileTag.hasOwnProperty("pivot_x"))
				{ 
					spriterFile.pivotX = (att.pivot_x);
				}
				if(fileTag.hasOwnProperty("pivot_y"))
				{ 
					spriterFile.pivotY = 1-(att.pivot_y);
				}
				this.folders[d].files.push(spriterFile);
			}
		}
		
		var objectArray=[];
		
		var NO_INDEX=-1;
		var entityTags = json.entity;
		for (var e = 0; e < entityTags.length; e++)
		{
			var entityTag=entityTags[e];
			att = entityTag;
			
			var objInfoTags = entityTag.obj_info;
			if(objInfoTags)
			{
				for (var o = 0; o < objInfoTags.length; o++)
				{
					var infoTag = objInfoTags[o];
					if(infoTag&&infoTag.type==="sprite")
					{
						var typeName=infoTag.name;
						objectArray.push(new SpriterObjectArrayItem(thisTypeName, typeName));
						var frames=infoTag.frames;
						if(frames)
						{
							for (var f = 0; f < frames.length; f++)
							{
								var frame = frames[f];
								if(this.folders[frame.folder]&&this.folders[frame.folder].files[frame.file])
								{
									objectArray[objectArray.length-1].frames.push
									(
									this.folders[frame.folder].files[frame.file].fileName
									);
								}
							}
						}
					}
				}
			}
		}
		return objectArray;
	}
	
	instanceProto.generateTestC2ObjectArray = function(objectArray)
	{	
		var c2Objects=[];
		var types=this.runtime.types;
		for(var o in objectArray)
		{
			var c2Object={};
			c2Object.type=types[objectArray[o].fullTypeName];
			c2Object.inst=null;
			c2Objects.push(c2Object);
		}
		return c2Objects;
	}
	
	instanceProto.cloneObject = function(other)
	{
		var folderIndex=-null;
		var fileIndex=null;
		var fileName=null;
		var NO_INDEX=-1;
		var object = new SpriterObject();
		object.type=other.type;
		object.frame=other.frame;
		object.storedFrame=other.storedFrame;
		object.x = (other.x);
		object.y = -(other.y);
		object.angle = ((other.angle));
		object.a = ((other.a));
		object.angle=other.angle;
		object.xScale = (other.xScale);
		object.yScale = (other.yScale);
		object.pivotX = (other.pivotX);
		object.pivotY = (other.pivotY);
		return object;
	}
	
	instanceProto.objectFromTag = function(objectTag,objectArray,timelineName,object_type)
	{
		var att=objectTag;
		
		var folderIndex=-null;
		var fileIndex=null;
		var fileName=null;
		var NO_INDEX=-1;
		var object = new SpriterObject();
		object.type=object_type;
		if(object_type==="sprite")
		{
			folderIndex=att.folder;
			fileIndex=att.file;
			file=this.folders[folderIndex].files[fileIndex];
			var objectItem=objectArray[findObjectItemInArray(timelineName,objectArray)];
			object.frame=objectItem.frames.indexOf(file.fileName);
			object.storedFrame=object.frame;
		}	
		
		if(objectTag.hasOwnProperty("x"))
		{ 
			object.x = (att.x);
		}
		if(objectTag.hasOwnProperty("y"))
		{ 
			object.y = -(att.y);
		}
		if(objectTag.hasOwnProperty("angle"))
		{ 
			object.angle = ((att.angle));
		}
		if(objectTag.hasOwnProperty("a"))
		{ 
			object.a = ((att.a));
		}
		object.angle=360-object.angle;
		object.angle/=360;
		
		if(object.angle>0.5)
		object.angle-=1;
		
		object.angle*=3.141592653589793*2;
		
		if(objectTag.hasOwnProperty("scale_x"))
		{ 
			object.xScale = (att.scale_x);
		}
		
		if(objectTag.hasOwnProperty("scale_y"))
		{ 
			object.yScale = (att.scale_y);
		}							
		
		if(objectTag.hasOwnProperty("pivot_x"))
		{ 
			object.pivotX = (att.pivot_x);
		}
		else if(object_type==="sprite")
		{
			var folders=this.folders;
			var folder=folders[folderIndex];
			if(folder)
			{
				var file=folder.files[fileIndex];
				if(file)
				{
					object.pivotX=file.pivotX;
				}
			}
		}	
		
		if(objectTag.hasOwnProperty("pivot_y"))
		{ 
			object.pivotY = 1-(att.pivot_y);
		}
		else if(object_type==="sprite")
		{
			var folders=this.folders;
			var folder=folders[folderIndex];
			if(folder)
			{
				var file=folder.files[fileIndex];
				if(file)
				{
					object.pivotY=file.pivotY;
				}
			}
		}	
		
		return object;
	}
	instanceProto.initDOMtoPairedObjects = function()
	{
		var entities=this.entities;
		for(var e=0;e<entities.length;e++)
		{
			var entity=entities[e];
			if(entity)
			{
				var animations=entity.animations;
				if(animations)
				{
					for(var a=0;a<animations.length;a++)
					{
						var animation=animations[a];
						if(animation)
						{
							var timelines=animation.timelines;
							if(timelines)
							{
								for(var t=0;t<timelines.length;t++)
								{
									var timeline=timelines[t];
									if(timeline)
									{
										timeline.c2Object=this.c2ObjectArray[findObjectItemInArray(timeline.name,this.objectArray)];
									}
								}
							}
						}
					}
				}
			}
		}
	}
	instanceProto.associateAllTypes = function ()
	{	
		var c2ObjectArray=this.c2ObjectArray;
		var objectArray=this.objectArray;
		
		for(var o in objectArray)
		{
			var obj=objectArray[o];
			
			var siblings=this.siblings;
			if(siblings.length>0)
			{
				for(var s=0;s<siblings.length;s++)
				{
					var sibling=siblings[s];
					if(sibling)
					{
						var type=sibling.type;
						if(type.name===obj.fullTypeName)
						{
							var c2Object=c2ObjectArray[o];
							c2Object.type=type;
							//var iid = this.get_iid(); // get my IID
							var paired_inst = sibling;
							c2Object.inst=paired_inst;
							var animations=this.entity.animations;
							var name=obj.name;
							for(var a=0;a<animations.length;a++)
							{
								var animation=animations[a];
								var timelines=animation.timelines;
								for(var t=0;t<timelines.length;t++)
								{
									var timeline=timelines[t];
									if(name==timeline.name)
									{
										timeline.c2Object=c2Object;
									}
								}
							}
							break;
						}
					}
				}
			}
			else
			{
				var obj=objectArray[o];
				var c2Object=c2ObjectArray[o];
				var type=c2Object.type;
				obj.fullTypeName=type.name;
				c2Object.type=type;
				var iid = this.get_iid(); // get my IID
				var paired_inst = type.instances[iid];
				c2Object.inst=paired_inst;
				var animations=this.entity.animations;
				break;
			}
		}
	}
	instanceProto.loadSCML = function (xml_)
	{
		var xml, tmp;
		try {
			if (this.runtime.isIE)
			{
				var versions = ["MSXML2.DOMDocument.6.0",
				"MSXML2.DOMDocument.3.0",
				"MSXML2.DOMDocument"];

				for (var i = 0; i < 3; i++){
					try {
						xml = new ActiveXObject(versions[i]);
						
						if (xml)
						break;
					} catch (ex){
						xml = null;
					}
				}
				
				if (xml)
				{
					xml.async = "false";
					xml.loadXML(xml_);
				}
			}
			else {
				tmp = new DOMParser();
				xml = tmp.parseFromString(xml_, "text/xml");
			}
		} 
		
		catch(e) 
		{
			xml = null;
		}
		
		if (xml)
		{
			this.xmlDoc = xml;
		}
		
		this.objectArray=this.findSprites(xml_);
		if(!this.type.objectArrays[this.properties[0]])
		{
			this.type.objectArrays[this.properties[0]]=this.objectArray;
		}
		this.c2ObjectArray=this.generateTestC2ObjectArray(this.objectArray);

		var thisTypeName=this.type.name;
		var att;
		
		var json=xml_;
		var folderTags = json.folder;

		var NO_INDEX=-1;
		var entityTags = json.entity;
		for (var e = 0; e < entityTags.length; e++)
		{
			var entityTag=entityTags[e];
			att=entityTag;
			
			var entity = new SpriterEntity();
			att=entityTag;
			entity.name=att.name;
			var animationTags = entityTag.animation;
			for (var a = 0; a < animationTags.length; a++)
			{
				var animationTag = animationTags[a];
				att=animationTag;
				var animation = new SpriterAnimation();
				animation.name=att.name;
				animation.length=att.length;
				
				if(animationTag.hasOwnProperty("looping"))
				{ 
					animation.looping = att.looping;
				}
				if(animationTag.hasOwnProperty("loop_to"))
				{ 
					animation.loopTo = att.loop_to;
				}
				
				var mainlineTag = animationTag.mainline;
				
				var mainline = new SpriterTimeline();
				
				
				var keyTags = mainlineTag.key;		
				for (var k = 0; k<keyTags.length; k++)
				{
					var keyTag = keyTags[k];
					
					var key = new SpriterKey();
					att=keyTag;
					
					if(keyTag.hasOwnProperty("time"))
					{ 
						key.time = att.time;
					}
					
					var boneRefTags = keyTag.bone_ref;	
					if(boneRefTags)
					{
						for (var o = 0; o < boneRefTags.length; o++)
						{
							var boneRefTag=boneRefTags[o];
							att=boneRefTag;
							var boneRef = new SpriterObjectRef();
							boneRef.timeline=att.timeline;
							boneRef.key=att.key;
							if(boneRefTag.hasOwnProperty("parent"))
							{ 
								boneRef.parent = att.parent;
							}
							key.bones.push(boneRef);
						}		
					}
					
					var objectRefTags = keyTag.object_ref;	
					if(objectRefTags)
					{
						for (var o = 0; o < objectRefTags.length; o++)
						{
							var objectRefTag=objectRefTags[o];
							att=objectRefTag;
							var objectRef = new SpriterObjectRef();
							objectRef.timeline=att.timeline;
							objectRef.key=att.key;
							if(objectRefTag.hasOwnProperty("parent"))
							{ 
								objectRef.parent = att.parent;
							}
							key.objects.push(objectRef);
						}		
					}
					
					animation.mainlineKeys.push(key);
				}	
				
				animation.mainline=mainline;
				var timelineTags = animationTag.timeline;
				if(timelineTags)
				{
					for (var t = 0; t < timelineTags.length; t++)
					{
						var timelineTag=timelineTags[t];
						
						att=timelineTag;
						
						var timeline = new SpriterTimeline();

						if(timelineTag.hasOwnProperty("object_type"))
						{	 
							timeline.objectType = att.object_type;
						}
						
						var timelineName=att.name;
						timeline.name=timelineName;
						
						var keyTags = timelineTag.key;		
						if(keyTags)
						{
							
							for (var k = 0; k<keyTags.length; k++)
							{
								var keyTag = keyTags[k];
								
								var key = new SpriterKey();
								att=keyTag;
								
								if(keyTag.hasOwnProperty("time"))
								{ 
									key.time = att.time;
								}
								if(keyTag.hasOwnProperty("spin"))
								{
									key.spin = (att.spin);
								}
								var objectTags = keyTag.object;
								if(objectTags)
								{		
									var objectTag=objectTags;
									var object=this.objectFromTag(objectTag,this.objectArray,timelineName,timeline.objectType);
									key.objects.push(object);
								}
								var boneTags = keyTag.bone;
								if(boneTags)
								{		
									var boneTag=boneTags;
									var bone=this.objectFromTag(boneTag,this.objectArray,timelineName,timeline.objectType);
									key.bones.push(bone);
								}
								timeline.keys.push(key);
							}		
						}
						timeline.c2Object=this.c2ObjectArray[findObjectItemInArray(timelineName,this.objectArray)];
						animation.timelines.push(timeline);
					}
				}
				entity.animations.push(animation);

			}
			this.entities.push(entity);
			if(!this.entity||this.properties[1]===entity.name)
			{
				this.entity=entity;
			}
		}		
	};
	
	instanceProto.doRequest = function (json,url_, method_)
	{
		// Create a context object with the tag name and a reference back to this
		var self = this;
		var request = null;
		
		var errorFunc = function () {
			//self.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, self);
		};
		
		try
		{
			var data = json;
			self.loadSCML(data);
			self.type.scmlFiles[self.properties[0]]=self.entities;
			self.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.readyForSetup, self);
			self.setAnimTo(self.properties[2],true);
			if(!self.currentAnimation&&self.entity&&self.entity.animations.length)
			{
				self.setAnimTo(entity.animations[0].name,true);
			}	
			
		}
		catch (e)
		{
			//errorFunc();
		}
		
	};
	
	instanceProto.getAnimFromEntity = function(animName)
	{
		for(var a in this.entity.animations)
		{
			if(this.entity.animations[a].name==animName)
			{
				return this.entity.animations[a];
			}
		}
	}
	
	instanceProto.mapObjToObj = function(parentObject,obj,flipAngle)
	{
		var returnObj=new SpriterObject();
		returnObj.xScale=obj.xScale*parentObject.xScale;
		returnObj.yScale=obj.yScale*parentObject.yScale;
		if(flipAngle<0)
		{
			returnObj.angle=((3.141592653589793*2)-obj.angle)+parentObject.angle;
		}
		else
		{
			returnObj.angle=obj.angle+parentObject.angle;
		}
		var x=obj.x*parentObject.xScale;
		var y=obj.y*parentObject.yScale;
		var angle=parentObject.angle;
		var a=parentObject.a*obj.a;
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		var xnew = (x * c) - (y * s);
		var ynew = (x * s) + (y * c);
		returnObj.pivotX=obj.pivotX;
		returnObj.pivotY=obj.pivotY;
		returnObj.x=xnew+parentObject.x;
		returnObj.y=ynew+parentObject.y;
		return returnObj;
	}
	instanceProto.instsEqual = function(obj,inst)
	{
		return obj.pivotX==inst.hotspotX&&
		obj.pivotY==inst.hotspotY&&
		obj.x==inst.x&&
		obj.y==inst.y&&
		obj.a==inst.opacity&&
		obj.angle==inst.angle&&
		obj.frame==inst.curFrame;
	}
	instanceProto.objFromInst = function(inst)
	{
		var obj = new SpriterObject();
		obj.pivotX=inst.hotspotX;
		obj.pivotY=inst.hotspotY;
		obj.x=inst.x;
		obj.y=inst.y;
		obj.a=inst.opacity;
		obj.angle=inst.angle;
		obj.frame=inst.curFrame;
		obj.storedFrame=inst.storedFrame;
		return obj;
	}
	
	instanceProto.applyObjToInst = function(obj,inst,dontApplyGlobalScale)
	{
		inst.hotspotX=obj.pivotX;
		inst.hotspotY=obj.pivotY;
		inst.x=obj.x;
		inst.y=obj.y;
		inst.angle=obj.angle;
		inst.opacity=obj.a;
		var cur_frame = inst.curFrame;
		var mirror_factor = (this.xFlip == 1 ? -1 : 1);
		var flip_factor = (this.yFlip == 1 ? -1 : 1);
		var new_width = (dontApplyGlobalScale?1:this.scaleRatio) * cur_frame.width * obj.xScale * mirror_factor;
		var new_height = (dontApplyGlobalScale?1:this.scaleRatio) * cur_frame.height * obj.yScale * flip_factor;
		
		if (inst.width !== new_width || inst.height !== new_height)
		{
			inst.width = new_width;
			inst.height = new_height;			
		}
		inst.set_bbox_changed();
	}
	instanceProto.setEntTo = function(entName)
	{
		var entities=this.entities;
		for(var e in entities)
		{
			var entity=entities[e];
			if(entity&&entName==entity.name)
			this.entity=entity;
		}
		if(!this.entity&&this.entities.length)
		{
			this.entity=entities[0];
		}
		if(!this.entity)
		{
			this.startingEntName=entName;
		}
	}
	instanceProto.setAllCollisionsAndVisibility = function(newState)
	{		
		var c2ObjectArray=this.c2ObjectArray;
		if(c2ObjectArray)
		{
			for(var o=0;o<c2ObjectArray.length;o++)
			{
				var c2Object=c2ObjectArray[o];
				var inst=c2Object.inst;
				if(!inst)
				{
					this.associateAllTypes();
				}
				if(inst)
				{
					inst.collisionsEnabled = newState;
					inst.visible=newState;
				}
			}
		}
	};
	
	instanceProto.setAnimTo = function(animName,tick)
	{
		tick = typeof tick !== 'undefined' ? tick : true;
		this.playTo=-1;
		this.changeAnimTo=this.getAnimFromEntity(animName);
		
		if(!this.changeAnimTo&&(!this.currentAnimation)&&this.entity)
		{
			this.changeAnimTo=this.entity.animations[0];
		}
		
		if(!this.changeAnimTo)
		{
			this.startingAnimName=animName;
		}
		
		var anim=this.currentAnimation;
		this.animPlaying=true;
		
		this.setAllCollisionsAndVisibility(false);
		
		this.runtime.tickMe(this);
		if(tick)
		{
			this.tick();
		}
	}
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.readyForSetup = function (copyToClipboard)
	{
		return true;
	};
	
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return this.currentAnimation.name.toLowerCase() === animname.toLowerCase();
	};
	
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		//this.runtime.trigger(cr.plugins_.Spriter.prototype.cnds.OnAnimFinished, this);
		return true;
	};
	// AddCmpParam("Current Key Frame is ", "Is the current Key Frame <,>,=,etc to the value below");
	// AddNumberParam("Frame","The frame number to compare the current key frame to" ,"0")	;
	// AddCondition(2,0, "Compare Current Key Frame", "Key Frames", "Current Key Frame is {0} {1}", "Compare the current key frame number.", "CompareCurrentKey");
	Cnds.prototype.CompareCurrentKey = function (cmp,frame)
	{
		return cr.do_cmp(this.cur_frame, cmp, frame);
	};
	// AddCmpParam("Current Animation Time is ", "Is the current time <,>,=,etc to the value below");
	// AddNumberParam("Time","The time to compare the current key frame to" ,"0")	;
	// AddComboParamOption("milliseconds");
	// AddComboParamOption("ratio of the animation length");
	// AddComboParam("Time Format", "Is the 'Time' value above expressed in milliseconds or as a ratio",0);	
	// AddCondition(3,0, "Compare Current Time", "Animations", "Current Time is {0} {1} {2}", "Compare the current time.", "CompareCurrentTime");
	Cnds.prototype.CompareCurrentTime = function (cmp,time,format)
	{
		if(format===0)//milliseconds
		{
			return cr.do_cmp(this.currentSpriterTime, cmp, time);
		}
		else
		{
			var anim=this.currentAnimation;
			if(anim)
			{
				return cr.do_cmp(this.currentSpriterTime/this.currentAnimation.length, cmp, time);
			}
			else
			{
				return false;
			}
		}
	};	
	
	// AddStringParam("Animation", "Is this the current animation.");
	// AddCondition(4, 0, "Compare Current Animation", "Animations", "Is current animation {0}", "Compare the name of the current animation.", "CompareAnimation");
	Cnds.prototype.CompareAnimation = function (name)
	{
		var anim=this.currentAnimation;
		if(anim&&anim.name===name)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	
	// AddCondition(5, 0, "Is Paused", "Animations", "If animation is paused", "Is animation paused?", "AnimationPaused");
	Cnds.prototype.AnimationPaused = function ()
	{
		return !this.animPlaying;
	};
	// AddCondition(6, 0, "Is Looping", "Animations", "If animation is looping", "Is animation set to loop?", "AnimationLooping");
	Cnds.prototype.AnimationLooping = function ()
	{
		var anim=this.currentAnimation;
		if(anim&&anim.looping==="true")
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.setPlaybackSpeedRatio = function (newSpeed)
	{		
		this.speedRatio=newSpeed;
	}
	
	Acts.prototype.setObjectScaleRatio = function (newScale,xFlip,yFlip)
	{		
		this.scaleRatio=newScale;
		this.xFlip=xFlip;
		this.yFlip=yFlip;
	}
	
	Acts.prototype.setAnim = function (animName,startFrom)
	{
		var ratio=0;
		this.changeToStartFrom=startFrom;
		this.setAnimTo(animName,false);		
		this.tick();
		
	};
	
	Acts.prototype.setEnt = function (entName,animName)
	{
		var newAnimName=animName;
		if(entName!=""&&((!this.entity)||entName!=this.entity.name))
		{
			this.setEntTo(entName);
		}
		if(this.currentAnimation&&newAnimName=="")
		{
			newAnimName=this.currentAnimation.name;		
		}
		this.setAnimTo(newAnimName);
		
	};
	
	Acts.prototype.playAnimTo = function (units,playTo)
	{
		if(units==0)// keyframes
		{
			var mainKeys=this.currentAnimation.mainlineKeys;
			if(mainKeys)
			{
				var key=mainKeys[playTo];
				if(key)
				{
					this.playTo=key.time;
				}
				else
				{
					this.playTo=-1;
					return;
				}
			}
		}
		else if(units==1)// milliseconds
		{
			this.playTo=playTo;
		}
		else if(units==2)// ratio
		{
			this.playTo=playTo*this.currentAnimation.length;
		}
		if(this.playTo==this.currentSpriterTime)
		{
			this.playTo=-1;
			return;
		}
		var reverseFactor=1;
		if(this.currentAnimation.looping=="true")
		{
			var forwardDistance=0;
			var backwardDistance=0;
			if(this.playTo>this.currentSpriterTime)
			{	
				forwardDistance=this.playTo-this.currentSpriterTime;
				backwardDistance=(this.currentAnimation.length-this.playTo)+this.currentSpriterTime;
			}
			else
			{
				forwardDistance=this.playTo+(this.currentAnimation.length-this.currentSpriterTime);
				backwardDistance=this.currentSpriterTime-this.playTo;
			}
			if(backwardDistance<forwardDistance)
			{
				reverseFactor=-1;
			}
		}
		else
		{
			if(this.playTo<this.currentSpriterTime)
			{
				reverseFactor=-1;	
			}
		}
		this.speedRatio=Math.abs(this.speedRatio)*reverseFactor;
		this.animPlaying=true;
		this.tick();
	};
	
	Acts.prototype.associateTypeWithName = function (type,name)
	{	
		var c2ObjectArray=this.c2ObjectArray;
		var objectArray=this.objectArray;
		
		for(var o in objectArray)
		{
			var obj=objectArray[o];
			if(name==obj.name)
			{
				obj.fullTypeName=type.name;
				var c2Object=c2ObjectArray[o];
				c2Object.type=type;
				var iid = this.get_iid(); // get my IID
				var paired_inst = type.instances[iid];
				c2Object.inst=paired_inst;
				var animations=this.entity.animations;
				for(var a in animations)
				{
					var animation=animations[a];
					var timelines=animation.timelines;
					for(var t in timelines)
					{
						var timeline=timelines[t];
						if(name==timeline.name)
						{
							timeline.c2Object=c2Object;
						}
					}
				}
				break;
			}
		}
	}
	Acts.prototype.setAnimationLoop = function (loopOn)
	{
		var currentAnimation=this.currentAnimation;
		if(currentAnimation)
		{
			if(loopOn==0)
			{
				currentAnimation.looping="false";
			}
			else if(loopOn==1)
			{
				currentAnimation.looping="true";
			}
		}
		else
		{
			if(loopOn==0)
			{
				this.startingLoopType="false";
			}
			else if(loopOn==1)
			{
				this.startingLoopType="true";
			}
		}
	}
	Acts.prototype.setAnimationTime = function (units,time)
	{
		var currentAnimation=this.currentAnimation;
		var lastSpriterTime=this.currentSpriterTime;
		if(currentAnimation)
		{
			if(units==0)// milliseconds
			{
				this.currentSpriterTime=time;
			}
			else if(units==1)// ratio
			{
				this.currentSpriterTime=time*currentAnimation.length;
			}
		}
		if(lastSpriterTime!=this.currentSpriterTime)
		{
			this.force=true;
		}
	}
	Acts.prototype.pauseAnimation = function ()
	{
		this.animPlaying=false;
	}
	
	Acts.prototype.resumeAnimation = function ()
	{
		this.animPlaying=true;
		var anim=this.currentAnimation;
		if(anim)
		{
			if(this.speedRatio>0)
			{
				if(this.currentSpriterTime==anim.length)
				this.currentSpriterTime=0;
			}
			else if(this.currentSpriterTime==0)
			{
				this.currentSpriterTime=this.currentAnimation.length;
			}
		}
	}
	
	Acts.prototype.removeAllCharMaps = function ()
	{
		var ent=this.currentEntity;
		if(ent)
		{
			for(var a=0;a<ent.animations.count();a++)
			{
				var anim=ent.animations[a];
				if(anim)
				{
					
				}			
			}			
		}
	};
	
	Acts.prototype.appendCharMap = function (mapName)
	{
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.time = function (ret)
	{
		ret.set_int(this.currentSpriterTime);
	};
	
	Exps.prototype.timeRatio = function (ret)
	{
		if(this.currentAnimation)
		{
			ret.set_float(this.currentSpriterTime/this.currentAnimation.length);
		}
		else
		{
			ret.set_float(0);
		}
	};
	
	Exps.prototype.ScaleRatio = function (ret)
	{
		ret.set_float(this.scaleRatio);
	};
	
	Exps.prototype.key = function (ret)
	{
		ret.set_int(this.cur_frame);
	};
	
	Exps.prototype.PlayTo = function (ret)
	{
		ret.set_int(this.playTo);
	};
	
	Exps.prototype.animationName = function (ret)
	{
		if(this.changeAnimTo)
		{
			ret.set_string(this.changeAnimTo.name);
		}
		else if(this.currentAnimation)
		{
			ret.set_string(this.currentAnimation.name);
		}
		else
		{
			ret.set_string("");
		}
	};
	
	Exps.prototype.entityName = function (ret)
	{
		if(this.entity)
		ret.set_string(this.entity.name);
		else
		ret.set_string("");
	};
	
	Exps.prototype.PlayToTimeLeft = function (ret)
	{
		if(this.playTo<0);
		{
			return ret.set_float(0);
		}
		
		if(this.currentAnimation.looping=="true")
		{
			var forwardDistance=0;
			var backwardDistance=0;
			if(speedRatio>=0)
			{
				if(this.playTo>this.currentSpriterTime)
				{	
					return ret.set_float(this.playTo-this.currentSpriterTime);
				}
				else
				{
					return ret.set_float(this.playTo+(this.currentAnimation.length-this.currentSpriterTime));
				}
			}
			else
			{
				if(this.playTo>this.currentSpriterTime)
				{	
					return ret.set_float((this.currentAnimation.length-this.playTo)+this.currentSpriterTime);
				}
				else
				{
					return ret.set_float(this.currentSpriterTime-this.playTo);
				}
			}
		}
		else
		{	
			return ret.set_float(Math.abs(this.playTo-this.currentSpriterTime));
		}
		
	};
	
	pluginProto.exps = new Exps();

}());