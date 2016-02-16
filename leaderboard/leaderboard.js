console.log('Hello World');

Boys = new Mongo.Collection('boys');

if(Meteor.isClient){
	Template.leaderboard.helpers({
		'boy' : function(){
			return Boys.find({}, {sort: {score:-1, name:1}})
		},
		'selectedClass' : function(){
			var boyId = this._id;
			var selectedBoy = Session.get('sessionPlaceHolder')
			if(selectedBoy == boyId){
				return "selected"
			}
		},
		'showSelectedBoy' : function(){
			var selectedBoy = Session.get('sessionPlaceHolder')
			return Boys.findOne(selectedBoy)	
		}
	});

	Template.leaderboard.events({
		'click .xyz':function(){
			console.log('You clicked a .xyz element');
			var boyId = this._id
			Session.set('sessionPlaceHolder',boyId);
		},
		'click .increment':function(){
			var selectedBoy = Session.get('sessionPlaceHolder')
			Boys.update(selectedBoy, {$inc:{'score':10}})
		},
		
		'click .decrement':function(){
			var selectedBoy = Session.get('sessionPlaceHolder')
			Boys.update(selectedBoy, {$inc:{'score':-5}})
		},
		'click .remove': function(){
			var selectedBoy = Session.get('sessionPlaceHolder');
			Boys.remove(selectedBoy);
		}		
	});

	Template.addBoyForm.events({
		'submit form' : function(event){
			event.preventDefault();
			console.log('Form submitted');
			var nameBoy = event.target.boyName.value;
			//var initialScore = event.target.initialScore.value;
			Boys.insert({name:nameBoy,score:0});
			Meteor.call('sendLogMessage');			
		}
	});

	Meteor.subscribe('theBoys');
}

if(Meteor.isServer){
	
	Meteor.publish('theBoys',function(){
		return Boys.find()
	});

	console.log(Boys.find().fetch())
	
	Meteor.methods({
		'sendLogMessage': function(){
			console.log("Hello world");
		}
	});
}



