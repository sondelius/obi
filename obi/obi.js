Students = new Mongo.Collection("students");

if (Meteor.isClient) {

    /* JQUERY */
    $(document).ready(function(){
      $('.tooltipped').tooltip({delay: 50});
    });

  /* ------------------------ Set Up JS -------------------------- */
    p1 = [{"pic":"a.jpg", "name": "Brad Pitt"}, {"pic":"b.jpg", "name": "Helen Matthews"}, 
          {"pic":"c.png", "name": "Dam Son"}, {"pic": "d.jpg", "name": "Snoop Dogg"}, 
          {"pic": "e.jpg", "name": "Elaine Thomas"}, {"pic": "f.jpg", "name": "Sarah Winkle"}];
    
    p2 = [{"pic":"pt1.jpg", "name": "Kelsey Shattock"}, {"pic":"pt2.jpg", "name": "Dipti Modi"}, 
          {"pic":"pt3.jpeg", "name": "Lorine Gonzales"}, {"pic": "pt4.jpg", "name": "James Walker"}, 
          {"pic": "pt5.jpg", "name": "Maria Hernandez"}, {"pic": "pt6.png", "name": "Sam Byfford"}];

    p3 = [{"pic":"pic1.jpeg", "name": "Johnathan Deaton"}, {"pic":"pic2.jpg", "name": "Frank Thomson"}, 
          {"pic":"pic3.jpeg", "name": "Candice Bradley"}, {"pic": "pic4.jpg", "name": "Irene Hsu"}, 
          {"pic": "pic5.jpeg", "name": "Melissa Hu"}, {"pic": "pic6.jpg", "name": "Rhea James"}];

    p4 = [{"pic":"pic7.jpeg", "name": "George Humphrey"}, {"pic":"pic8.jpeg", "name": "Marshal Jeffrey"}, 
          {"pic":"pic9.jpeg", "name": "Sam Pieland"}, {"pic": "pic10.jpg", "name": "Courteny Bryant"}, 
          {"pic": "pic11.jpg", "name": "Jacky Huddle"}, {"pic": "pic12.jpg", "name": "Megan Seaton"}];
    pAll = p1.concat(p2, p3, p4);

    learningStrats = ["Individualized Attention", "Group Work", "Hands on activities", 
          "Movies", "Guest Speakers", "Field Trips", "Vollunteer Work", "Tutoring", 
          "Pair Work", "Peer Teaching"];
    
    interests = ["Fishing", "International Politics", "US History", "Harry Potter", 
          "All things Disney", "Gymnastics", "Break Dancing", "Pottery", "Swimming", "Philosophy of mind",
          "Anime", "Education Policy", "Salsa Dancing", "Friends (show)", "Programming",
          "Video game design", "Parenting", "The Red Hot Chile Peppers", "The Arctic Monkeys",
          "Fall Out Boy", "Lupe Fiasco", "John Legend", "The Beatles", "French Literature"];

    periods = [p1, p2, p3, p4];
    numStrats = learningStrats.length;
    numInterests = interests.length;
    numStudents = p1.length;

    Template.main.events({
      "click #add-data": function() {
        console.log("add-data");
        console.log("length: "+Students.find().count());
        for (j = 0; j < periods.length; j++) {
          p = periods[j]
          for (i = 0; i < p1.length; i++) {
            Students.insert({
              Name: p[i].name,
              picture: p[i].pic,
              strats: [learningStrats[Math.floor(Math.random()*numStrats)], learningStrats[Math.floor(Math.random()*numStrats)],
                        learningStrats[Math.floor(Math.random()*numStrats)], learningStrats[Math.floor(Math.random()*numStrats)]],
              ints: [interests[Math.floor(Math.random()*numInterests)], interests[Math.floor(Math.random()*numInterests)],
                        interests[Math.floor(Math.random()*numInterests)], interests[Math.floor(Math.random()*numInterests)]],
              friends: [p[Math.floor(Math.random()*numStudents)], p[Math.floor(Math.random()*numStudents)], p[Math.floor(Math.random()*numStudents)],
                        p[Math.floor(Math.random()*numStudents)], p[Math.floor(Math.random()*numStudents)]],
              frowning: false,
              frown: "sadface_unactive.png",
              hearting: false,
              heart: "heart_inactive.png",
              period: j + 1,
              helped: false
            });
          }
        }
        brad = Students.find({Name: "Brad Pitt"}).fetch()[0];
        Students.update(brad._id, {$set: {hearting: true}});
        Students.update(brad._id, {$set: {heart: "heart_outline.png"}});
        Students.update(brad._id, {$set: {helped: true}});
      },
      "click #remove-data": function() {
        console.log("remove");
        for (i = 0; i < pAll.length; i++) {
          console.log(pAll[i].name);
          console.log(Students.findOne({Name: pAll[i].name})._id);
          Students.remove({_id: Students.findOne({Name: pAll[i].name})._id});
        }
        // Students.remove({});
      }, 
      "click .picture": function(event) {
        Session.set("student", this.Name);
        console.log(Session.get("student"));
        console.log(Students.find({Name: Session.get("student")}).Name);
      }
    });

    Template.main.rendered = function() {
      
    }

    Template.HomePage.rendered = function() {
      $('ul.tabs').tabs();
      $('ul.tabs').tabs('select_tab', 'p1');
      $('.notification-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'right',
        closeOnClick: true,
      });
      $('.button-collapse').sideNav();
      if (Session.get("home_intro") == true) {
        home_intro_dialogue();
        Session.set("home_intro", false);
      }
    }

    Template.ProfileContent.rendered = function() {
      $('ul.tabs').tabs();
      $('ul.tabs').tabs('select_tab', 'p1');
      $('.tooltipped').tooltip({delay: 50});
      if (Session.get("profile_intro") == true) {
        profile_intro_dialogue();
        Session.set("profile_intro", false);
      }
    }

    Template.SignIn.rendered = function() {
      Session.set("home_intro", true);
      Session.set("profile_intro", true);
    }

    var home_intro_dialogue = function() {
      $("#home_intro_modal").openModal();
      // $("#intro_modal")
    }

    var profile_intro_dialogue = function() {
      $("#profile_intro_modal").openModal();
    }

    /* --------------------------------- Template JS ---------------------------------- */

    Template.main.helpers({
        your_orange_hearts: function() {
            yourHelped = Students.find({you_helped: true}).fetch();
            console.log(yourHelped);
            return yourHelped;
        }
    })

    //called when you don't follow through with removing a heart.
    var sure_callback = function (id) {
      
    }

    var heart_yes_click = function(id) {
     note_toast = "<a class='waves-effect waves-light btn heart_note_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>add explanation</a>";
     heart_given_toast = "Purple Heart awarded";
      Students.update(id, {$set: {hearting: true}});
      Students.update(id, {$set: {heart: "heart_active.png"}});
      $(".hearty_toast")[0].remove();
      $(".heart_sure_toast")[0].remove();
      Materialize.toast(heart_given_toast, 5000, "heart_given_toast");
      Materialize.toast(note_toast, 5000, "heart_note_toast");
      $(".heart_note_button").click(function(){
            $("#heart-note-modal").openModal();
            $(".heart_note_toast")[0].remove();
            $(".heart_given_toast")[0].remove();
        });
    }

    var heart_no_click = function() {
      $(".hearty_toast")[0].remove();
      $(".heart_sure_toast")[0].remove();
    }

    //confirms heart removal
    var sure_click = function(id) {
        //note_toast = "<a class='waves-effect waves-light btn heart_remove_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>add explanation</a>";
        removed_toast = "Heart removed";
        Students.update(id, {$set: {hearting: false}});
        Students.update(id, {$set: {heart: "heart_inactive.png"}});
        Materialize.toast(removed_toast, 5000, "removed_toast");
       // Materialize.toast(note_toast, 5000, "note_toast");
        $(".sure_toast")[0].remove();
        $(".info_toast")[0].remove();

        //$(".heart_remove_button").click(function(){
            //$(".removed_toast")[0].remove();
            //$(".note_toast")[0].remove();
            $("#heart-remove-modal").openModal();
        //});
    }

    Template.HomePage.helpers({
        getNumHearts: function() {
            return Students.find({hearting: true}).fetch().length;
        }
    });
    

    Template.HomePage.events({
      "click .frownBtn": function(event) {
        console.log("frown");
        // handles all dialogues in giving a frowny
        if (this.frowning == true) {
          console.log("frown2");
          Students.update(this._id, {$set: {frowning: false}});
          Students.update(this._id, {$set: {frown: "sadface_unactive.png"}});
          undone_toast = "Removed";
          Materialize.toast(undone_toast, 1000);
          $(".btn-toast")[0].remove();
          $(".frowny-toast")[0].remove();
        // handles all dialogues in removing a frowny
        } else {
          toast3 = "<a class='waves-effect waves-light btn add_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>add explanation</a>";
          toast2 = $('<div class="fixed-action-btn horizontal"><a class="btn-floating btn-large red"><i class="large material-icons">mode_edit</i></a><ul><li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li><li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li><li><a class="btn-floating green"><i class="material-icons">publish</i></a></li><li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li></ul></div>');
          toast = "You have marked " + this.Name + " as feeling down today. Press again to remove";
          Materialize.toast(toast, 7000, "frowny-toast");
          Materialize.toast(toast3, 7000, "btn-toast");
          Students.update(this._id, {$set: {frowning: true}});
          Students.update(this._id, {$set: {frown: "sadface5.png"}});
          $(".add_button").click(function(){
            $("#note-modal").openModal();
            $(".btn-toast")[0].remove();
            $(".frowny-toast")[0].remove();
          });
        }      
      },
      "click .heartBtn": function(event) {
        var id = this._id

        if (this.Name == "Brad Pitt") {
          brad_toast = "You cannot remove another teacher's orange heart";
          Materialize.toast(brad_toast, 5000);
        }
        // handles all dialogues for removing a heart
        if (this.hearting == true && this.Name != "Brad Pitt") { //this.heart = "active_heart.png" && this.hearting == true
          
          info_toast = "You are trying to remove " + this.Name + "'s purple heart. All of " 
                + this.Name + "'s teachers and counselors will be alerted in 5 minutes. Do you wish to continue?";
          sure_toast = "<a class='waves-effect waves-light btn sure_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>Yes</a>" +
          "<a class='waves-effect waves-light btn no_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>No</a>";
          Materialize.toast(info_toast, 5000, "info_toast");
          Materialize.toast(sure_toast, 5000, "sure_toast", function(){sure_callback(id)});
          $(".sure_button").click(function() { sure_click(id)});
            $(".no_button").click(function() {
                $(".sure_toast")[0].remove();
                $(".info_toast")[0].remove();
            });
          $(".note_toast").click(function(){
            $("note_toast")[0].remove();
            $("sure_toast")[0].remove();
            $("info_toast")[0].remove();
          });  
          Students.update(this._id, {$set: {you_helped: false}});
          Students.update(this._id, {$set: {helped: false}});
        //else if (this.heart == "active_heart.png" && this.hearting == false) just run undo toast
        // handles all dialogues for adding a heart
        } else if (this.hearting == false) {
          toast = "You are about to award " + this.Name + " a purple heart. All of " 
                + this.Name + "'s teachers and counselors will be alerted. Continue?";
          sure_toast = "<a class='waves-effect waves-light btn heart_yes_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>Yes</a>" +
          "<a class='waves-effect waves-light btn heart_no_button' style='background-color: #323232; border: 1px solid white; margin: 0;'>No</a>";
          Materialize.toast(toast, 5000, "hearty_toast");
          Materialize.toast(sure_toast, 999999, "heart_sure_toast");
         // Materialize.toast(note_toast 5000, "note_toast");
          //move this to toast dismiss callback
          // Students.update(this._id, {$set: {hearting: true}});
          // Students.update(this._id, {$set: {heart: "heart_active.png"}});
          $(".heart_yes_button").click(function() { heart_yes_click(id)});
          $(".heart_no_button").click(function() {heart_no_click(id)});
        
        }

      },

      "click .modal-action": function(event) {
          $("input").val("");
      },
      "click #submit-note": function(event) {
        
        toast = "This note has been saved to your personal records."
        Materialize.toast(toast, 5000, "frowny-toast");
      },
      "click .note_chip": function(event) {
        var text = $(event.target).text();
        var input = $("input");
        $(input).val($(input).val().trim() + " | " + text.trim());
        //alert($("input").val());
      }
    });

    Template.studentsGrid.helpers({
      getStudents: function (i) {
        return Students.find({period: i});
      },
      getStudent: function(name) {
        console.log("getStudent");
        // console.log("name: " + name);
        studentObj = Students.find({Name: name});
        console.log(studentObj.Name);
        return student_obj;
      }
    });

    Template.studentsGrid.events({
      "click .prof-img": function(event) {
        Session.set("student", this.Name);
        console.log(Session.get("student"));
        console.log(Students.find({Name: Session.get("student")}).Name);
      }
      // "click .heartBtn": function(event) {
      //   modalName = "#heartModal" + this._id;
      //   console.log(modalName);
      //   $(modalName).openModal();
      // },
      // "click .frownBtn": function(event) {
      //   modalName = "#frownModal" + this._id;
      //   console.log(modalName);
      //   $(modalName).openModal();
      // }
    });

    Template.heartsGrid.helpers({
      getHearts: function () {
        console.log('Hearts');
        return Students.find({hearting: true});
      }
    });

    Template.heartsGrid.events({
      "click .prof-img": function(event) {
        Session.set("student", this.Name);
        console.log(Session.get("student"));
        console.log(Students.find({Name: Session.get("student")}).Name);
      }
      // "click .heartBtn": function(event) {
      //   Materialize.toast('I am a toast!', 4000);
      // },
      // "click .frownBtn": function(event) {
      //   Materialize.toast('I am a toast!', 4000);
      // }
      // "click .heartBtn": function(event) {
      //   modalName = "#heartsHeartModal" + this._id;
      //   console.log(modalName);
      //   $(modalName).openModal();
      // },
      // "click .frownBtn": function(event) {
      //   modalName = "#heartsFrownModal" + this._id;
      //   console.log(modalName);
      //   $(modalName).openModal();
      // }
    });

    Template.Profile.helpers({
      student: function () {
        student = Session.get("student");
        console.log("hi, " + student);
        student_obj = Students.find({Name: student}).fetch()[0];
        console.log(student_obj.Name);
        return student_obj;
      }  
    });

    Template.ProfileContent.helpers({
      getStrat: function (i) {
        student = Session.get("student");
        student_obj = Students.find({Name: student}).fetch()[0];
        console.log(student_obj.strats);
        return student_obj.strats[i];
      },
      chip_1: function() {
        return Session.get("chip_1");
      },
      isBrad: function() {
        return this.Name == "Brad Pitt";
      }
    });

    Template.ProfileContent.events({
      "click .plus_one": function(e) {
        $(e.target).html("<img src='profile_icon.jpg'>Jane Doe");
      },
      "click .add_one": function(event) {
        $('#add-one-modal').openModal();
        Session.set("add_one", event.target.id);
      },

      "submit .add_one_form": function(event) {
          event.preventDefault();
         // var text = event.target.text.value;
          var val = $(".add_one_form input").val();

          var add_one = $("#" + Session.get("add_one"))[0];
          $(add_one).before("<div class='chip spaced_chip'> <img src='profile_icon.jpg'>" + val + "</div>"); 
      },

      "click .reach_out_btn": function(event) {
            Students.update(this._id, {$set: {helped: "true"}});
            Students.update(this._id, {$set: {heart: "heart_outline.png"}});
            Students.update(this._id, {$set: {you_helped: true}});
            // $(event.target).replaceWith("<div class='chip tooltipped' data-position='bottom' data-delay='50' data-tooltip='Jane Doe'> <img src='profile_icon.jpg'> is reaching out </div>");
      }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.route('/Profile');
Router.route('/HomePage');
Router.route('/', {
    name: 'SignIn',
    template: 'SignIn'
});

Router.configure({
    layoutTemplate: 'main'
});
