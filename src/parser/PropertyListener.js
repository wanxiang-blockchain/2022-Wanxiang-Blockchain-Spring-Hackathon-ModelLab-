// Generated from Property.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by PropertyParser.
function PropertyListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

PropertyListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
PropertyListener.prototype.constructor = PropertyListener;

// Enter a parse tree produced by PropertyParser#check.
PropertyListener.prototype.enterCheck = function(ctx) {
};

// Exit a parse tree produced by PropertyParser#check.
PropertyListener.prototype.exitCheck = function(ctx) {
};


// Enter a parse tree produced by PropertyParser#time.
PropertyListener.prototype.enterTime = function(ctx) {
};

// Exit a parse tree produced by PropertyParser#time.
PropertyListener.prototype.exitTime = function(ctx) {
};


// Enter a parse tree produced by PropertyParser#role.
PropertyListener.prototype.enterRole = function(ctx) {
};

// Exit a parse tree produced by PropertyParser#role.
PropertyListener.prototype.exitRole = function(ctx) {
};


// Enter a parse tree produced by PropertyParser#expr.
PropertyListener.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by PropertyParser#expr.
PropertyListener.prototype.exitExpr = function(ctx) {
};



exports.PropertyListener = PropertyListener;