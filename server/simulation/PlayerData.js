var Backbone = require("backbone"),
    _ = require("underscore");

var PlayerData = Backbone.Model.extend({
    defaults: {
        nick: null,
        client: null,
        names: null
    },
    
    initialize: function() {
        if(!_.isEmpty(this.get("jsonContent"))) {
            this.buildWithJson(this.get("jsonContent"));
        }
    },
    
    buildWithJson: function(jsonContent) {
        var names = [];
        _.each(jsonContent.names, function(name){
            names.push(name);
        });
        
        this.set("nick", jsonContent.nick);        
        this.set("names", names);
    },

    valid: function() {
        var valid = true;
        if (!this.get("nick") || this.get("actions").size() != 5 ) {
            valid = false;
        }
        return valid;
    }
});

module.exports = PlayerData;