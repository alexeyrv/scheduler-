//<!--  VUE JS -->
'use strict';
//import Vue from './vue.js'
// import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.runtime.global.js'
import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'

const vm = new Vue({
  el: "#app",
  mounted:function(){
    this.rooms = [];
    this.createSchedule( 2021, "room 0" );
    this.createSchedule( 2021, "room 1" );
    this.createSchedule( 2022, "room 1" );

    this.changeRoom( 0 );
  },

  data: {
    lgn: "",
    pswd: "",
    currentUser: {name:"", role:"", userInd: ""},
    selectedUserId: "0",
  	users: [ 
    	{id: "0",isDisplay: 1, workUnits:366, usedUnits: 366, name:"no one", role:"user", pswd:"", color:"#fafafa"},
    	{id: "777", isDisplay: 0, workUnits:366, usedUnits: 0, name:"admin", role:"admin", pswd:"admin",  color:"#ffabab"},
    	{id: "55",isDisplay: 1, workUnits:366,  usedUnits: 0, name:"Max", role:"manager", pswd:"qwe",  color:"#ffab00"},
    	{id: "1",isDisplay: 1, workUnits:366,  usedUnits: 0, name:"Jan", role:"user", pswd:"qwe",  color:"#abffab"},
    	{id: "2",isDisplay: 1, workUnits:366,  usedUnits: 0, name:"Karel", role:"user", pswd:"qwe",  color:"#abffff"},
    	{id: "3",isDisplay: 1, workUnits:366,  usedUnits: 0, name:"Petr", role:"user", pswd:"qwe",  color:"#ffffab"}
    ],
  	schedule: [],
    rooms: [], //[ {id: 0, name:"room 1", schedule: [] } ],
    currentRoom: 0,
    weekDays: ["Sun","Mon","Tue","Wen","Thu","Fri","Sat"],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],

  },
  methods: {
  	createSchedule: function( year, roomName ){
    	
      this.schedule = [];
      
      for( let m=0; m<12; m++){
      	this.schedule.push( { month: "0"+(m+1), days: []  } )
        
        let monthDays = this.maxDaysInMonth( m, year );
				for( let d = 1; d <= monthDays; d++){
          let weekDayNum = this.getDayOfWeek(year, m, d);
          let newUserId = 0; //(Math.floor(Math.random() * 5))+0;

        	this.schedule[m].days.push( {
            dayId: ( ""+ year +"-"+ (m+1) +"-" +d ),
            dayNum: d,
            dayOfWeek: weekDayNum,
            dayName: this.weekDays[ weekDayNum ],
            assignedTo: this.users[ newUserId ].id , // random
            color: "#fafafa", //this.users[ newUserId ].color, 
            isRejected: 0,
          } );

          // let uInd = this.users.findIndex(item => item.id === this.selectedUserId );
          // this.schedule[m].days.color = 
        }

      }

      
      this.rooms.push( { id:0, year: year, name: roomName, schedule:[...this.schedule] } );
      
      console.log( "### Rooms ", roomName, " in ", year, " = ", this.rooms );
      // console.log( "TEST =", this.rooms[0][0].days[0].dayId );
    
      // console.log( "Shedule = ", this.schedule )
		},

    changeRoom: function( roomInd  ){
      this.currentRoom = roomInd;

      console.log( "Room by Index", this.rooms[ this.currentRoom ].schedule );
      this.schedule = this.rooms[ this.currentRoom ].schedule;

      console.log( "currentRoom Room (index) = " + this.currentRoom );
      console.log( "Schedule now", this.schedule );

    },
    
    maxDaysInMonth: function(month,year) {
	    return new Date(year, month+1, 0).getDate();
    },
    getDayOfWeek: function(year, month, day) {
	    return new Date(year, month, day).getDay();
    },
    getNameOfMonth: function(day, month, year) {
	    return new Date(year, month+1, 0).getDate();
    },

    loginTo: function() {
      let uInd = this.users.findIndex(item => item.name == this.lgn );
      console.log( "lgn= ", this.lgn )
      console.log( "Logged in uInd=", uInd );
      if( uInd == -1 ){ alert( "Wrong login" ); return; }
      if( this.pswd != this.users[ uInd ].pswd ){ alert( "wrong password", this.pswd ); return; }

      this.currentUser.name = this.users[ uInd ].name;
      this.currentUser.role = this.users[ uInd ].role;
      this.currentUser.userInd = uInd;
      // console.log( "this.users[ uInd ].name;", this.users[ uInd ].name );
      // console.log( "this.users[ uInd ].role;", this.users[ uInd ].role );
      // console.log( "uInd= ", uInd );
      console.log( "Logged in user: ", this.currentUser );
      console.log( "users= ", this.users );
    },
    logout: function() {
      this.lgn = "";
      this.pswd = "";
      this.currentUser.name = "";
      this.currentUser.role = "";
      this.currentUser.userInd = "";
      this.selectedUserId = "0";
    },
    
    selectUser: function( userId ){
    	this.selectedUserId = userId;
    },


  	rejectIt: function( event ){ // get ID of clicked element
      if( !this.currentUser.userInd ) return; // if user is not registed
      if( this.users[ this.currentUser.userInd ].role != "user" ) return; // user role can't assign just reject
      // if( event.type !== "click" && event.buttons === 0 ) return; // if event type not click or button not pressed
      console.log( "DblClick Event= ", event);

      let targetId = 0;
      targetId = event.currentTarget.id; 
      // alert("targetId= ["+ targetId +"]" );
      let el = document.getElementById( targetId );
      // console.log( "Element= ", el );
      let elId = el.id;
      let arrId = elId.split("-");
      // console.log( "Id in the array= ", arrId );
      
      // set reject to user and reset reject to 0
      if( this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ].assignedTo == this.users[ this.currentUser.userInd ].id ){
        if( this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ].isRejected == 0){
          this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ].isRejected = this.users[ this.currentUser.userInd ].id;
        }else{
          this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ].isRejected = 0;
        }
      }

      
    },

  	assignIt: function( event ){ // get ID of clicked element
      // console.log( "Event= ", event);
      if( !this.currentUser.userInd ) return; // if user is not registed
      if( this.users[ this.currentUser.userInd ].role == "user" ) return; // user role can't assign just reject
      if( event.type !== "click" && event.buttons === 0 ) return; // if event type not click or button not pressed

      let targetId = 0;
      targetId = event.currentTarget.id; 
    // alert("targetId= ["+ targetId +"]" );
      let el = document.getElementById( targetId );
      console.log( "Element= ", el );
      let elId = el.id;
      let arrId = elId.split("-");
      console.log( "Id in the array= ", arrId );
      
      console.log( "assignedTo= ", this.schedule[ arrId[1]-1 ].days[ arrId[2]-1 ].assignedTo );
      console.log( "SelectedUserId= ", this.selectedUserId );
      // get Selected User Index 
      let uInd = this.users.findIndex(item => item.id === this.selectedUserId );
      console.log( "User Indes = ", uInd, "User ",  this.users[uInd] );

      // if this day assigned to selected user then Return... no need any action
      if( this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ].assignedTo === this.users[uInd].id ) return;

      let aToInd = this.users.findIndex(item => item.id ==  
        this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ].assignedTo );
      console.log( "aToInd = ", aToInd, "uInd ",  uInd );

      this.users[aToInd].usedUnits--;
      this.users[uInd].usedUnits++;

      this.$set( this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ], 
        'assignedTo',  this.selectedUserId );
      

      // let selectedUserObj = this.users.filter(obj => {
      //   return obj.id === this.selectedUserId;
      // })
      // console.log( "Selected user obj: ", selectedUserObj );
      // if( selectedUserObj.workUnits - selectedUserObj.usedUnits == 0 ) return;


      // console.log( "Selected Color= ", this.users[uInd].color );
      this.$set( this.schedule[ (arrId[1]-1) ].days[ (arrId[2]-1) ], 'color',  this.users[uInd].color )

      //doesn't work now
      // Vue.set( schedule[ arrId[1] ].days[ arrId[2] ], assignedTo, 99 )
      
      // console.log( "assignedTo= ", this.schedule[ arrId[1]-1 ].days[ arrId[2]-1 ].assignedTo );
      
      // console.log( "Schedule: ", this.schedule )

    },
  	say: function( msg, event ){ // change element ID by click - just test
    	console.log( "event= ", event );
      this.dcell[0].id = 10;
      //alert( event );
    },
  	toggle: function(todo){
    	todo.done = !todo.done
    }
  }
})

