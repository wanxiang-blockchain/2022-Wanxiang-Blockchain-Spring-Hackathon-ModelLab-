// Generated from Property.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');
var PropertyListener = require('./PropertyListener').PropertyListener;
var PropertyVisitor = require('./PropertyVisitor').PropertyVisitor;

var grammarFileName = "Property.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u000f*\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0003\u0002\u0006\u0002\f\n\u0002\r\u0002",
    "\u000e\u0002\r\u0003\u0002\u0006\u0002\u0011\n\u0002\r\u0002\u000e\u0002",
    "\u0012\u0003\u0002\u0006\u0002\u0016\n\u0002\r\u0002\u000e\u0002\u0017",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0005\u0006\u0005#\n\u0005\r\u0005\u000e",
    "\u0005$\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0002\u0002",
    "\u0006\u0002\u0004\u0006\b\u0002\u0003\u0003\u0002\t\u000e\u0002)\u0002",
    "\u000b\u0003\u0002\u0002\u0002\u0004\u0019\u0003\u0002\u0002\u0002\u0006",
    "\u001d\u0003\u0002\u0002\u0002\b\"\u0003\u0002\u0002\u0002\n\f\u0005",
    "\u0004\u0003\u0002\u000b\n\u0003\u0002\u0002\u0002\f\r\u0003\u0002\u0002",
    "\u0002\r\u000b\u0003\u0002\u0002\u0002\r\u000e\u0003\u0002\u0002\u0002",
    "\u000e\u0010\u0003\u0002\u0002\u0002\u000f\u0011\u0005\u0006\u0004\u0002",
    "\u0010\u000f\u0003\u0002\u0002\u0002\u0011\u0012\u0003\u0002\u0002\u0002",
    "\u0012\u0010\u0003\u0002\u0002\u0002\u0012\u0013\u0003\u0002\u0002\u0002",
    "\u0013\u0015\u0003\u0002\u0002\u0002\u0014\u0016\u0005\b\u0005\u0002",
    "\u0015\u0014\u0003\u0002\u0002\u0002\u0016\u0017\u0003\u0002\u0002\u0002",
    "\u0017\u0015\u0003\u0002\u0002\u0002\u0017\u0018\u0003\u0002\u0002\u0002",
    "\u0018\u0003\u0003\u0002\u0002\u0002\u0019\u001a\u0007\u0003\u0002\u0002",
    "\u001a\u001b\u0007\u0007\u0002\u0002\u001b\u001c\u0007\u0004\u0002\u0002",
    "\u001c\u0005\u0003\u0002\u0002\u0002\u001d\u001e\u0007\b\u0002\u0002",
    "\u001e\u001f\u0007\u0005\u0002\u0002\u001f \u0007\b\u0002\u0002 \u0007",
    "\u0003\u0002\u0002\u0002!#\t\u0002\u0002\u0002\"!\u0003\u0002\u0002",
    "\u0002#$\u0003\u0002\u0002\u0002$\"\u0003\u0002\u0002\u0002$%\u0003",
    "\u0002\u0002\u0002%&\u0003\u0002\u0002\u0002&\'\u0007\u0007\u0002\u0002",
    "\'(\u0007\u0006\u0002\u0002(\t\u0003\u0002\u0002\u0002\u0006\r\u0012",
    "\u0017$"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'After'", "'days'", "'.'", "'%'" ];

var symbolicNames = [ null, null, null, null, null, "INT", "ID", "EQUALS", 
                      "NOT_EQUALS", "LESS_THAN", "LESS_OR_EQUALS", "GREATER_THAN", 
                      "GREATER_OR_EQUALS", "WS" ];

var ruleNames =  [ "check", "time", "role", "expr" ];

function PropertyParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

PropertyParser.prototype = Object.create(antlr4.Parser.prototype);
PropertyParser.prototype.constructor = PropertyParser;

Object.defineProperty(PropertyParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

PropertyParser.EOF = antlr4.Token.EOF;
PropertyParser.T__0 = 1;
PropertyParser.T__1 = 2;
PropertyParser.T__2 = 3;
PropertyParser.T__3 = 4;
PropertyParser.INT = 5;
PropertyParser.ID = 6;
PropertyParser.EQUALS = 7;
PropertyParser.NOT_EQUALS = 8;
PropertyParser.LESS_THAN = 9;
PropertyParser.LESS_OR_EQUALS = 10;
PropertyParser.GREATER_THAN = 11;
PropertyParser.GREATER_OR_EQUALS = 12;
PropertyParser.WS = 13;

PropertyParser.RULE_check = 0;
PropertyParser.RULE_time = 1;
PropertyParser.RULE_role = 2;
PropertyParser.RULE_expr = 3;


function CheckContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PropertyParser.RULE_check;
    return this;
}

CheckContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CheckContext.prototype.constructor = CheckContext;

CheckContext.prototype.time = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(TimeContext);
    } else {
        return this.getTypedRuleContext(TimeContext,i);
    }
};

CheckContext.prototype.role = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(RoleContext);
    } else {
        return this.getTypedRuleContext(RoleContext,i);
    }
};

CheckContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

CheckContext.prototype.enterRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.enterCheck(this);
	}
};

CheckContext.prototype.exitRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.exitCheck(this);
	}
};

CheckContext.prototype.accept = function(visitor) {
    if ( visitor instanceof PropertyVisitor ) {
        return visitor.visitCheck(this);
    } else {
        return visitor.visitChildren(this);
    }
};




PropertyParser.CheckContext = CheckContext;

PropertyParser.prototype.check = function() {

    var localctx = new CheckContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, PropertyParser.RULE_check);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 9; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 8;
            this.time();
            this.state = 11; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while(_la===PropertyParser.T__0);
        this.state = 14; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 13;
            this.role();
            this.state = 16; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while(_la===PropertyParser.ID);
        this.state = 19; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 18;
            this.expr();
            this.state = 21; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << PropertyParser.EQUALS) | (1 << PropertyParser.NOT_EQUALS) | (1 << PropertyParser.LESS_THAN) | (1 << PropertyParser.LESS_OR_EQUALS) | (1 << PropertyParser.GREATER_THAN) | (1 << PropertyParser.GREATER_OR_EQUALS))) !== 0));
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function TimeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PropertyParser.RULE_time;
    return this;
}

TimeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TimeContext.prototype.constructor = TimeContext;

TimeContext.prototype.INT = function() {
    return this.getToken(PropertyParser.INT, 0);
};

TimeContext.prototype.enterRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.enterTime(this);
	}
};

TimeContext.prototype.exitRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.exitTime(this);
	}
};

TimeContext.prototype.accept = function(visitor) {
    if ( visitor instanceof PropertyVisitor ) {
        return visitor.visitTime(this);
    } else {
        return visitor.visitChildren(this);
    }
};




PropertyParser.TimeContext = TimeContext;

PropertyParser.prototype.time = function() {

    var localctx = new TimeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, PropertyParser.RULE_time);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 23;
        this.match(PropertyParser.T__0);
        this.state = 24;
        this.match(PropertyParser.INT);
        this.state = 25;
        this.match(PropertyParser.T__1);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function RoleContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PropertyParser.RULE_role;
    return this;
}

RoleContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RoleContext.prototype.constructor = RoleContext;

RoleContext.prototype.ID = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.ID);
    } else {
        return this.getToken(PropertyParser.ID, i);
    }
};


RoleContext.prototype.enterRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.enterRole(this);
	}
};

RoleContext.prototype.exitRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.exitRole(this);
	}
};

RoleContext.prototype.accept = function(visitor) {
    if ( visitor instanceof PropertyVisitor ) {
        return visitor.visitRole(this);
    } else {
        return visitor.visitChildren(this);
    }
};




PropertyParser.RoleContext = RoleContext;

PropertyParser.prototype.role = function() {

    var localctx = new RoleContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, PropertyParser.RULE_role);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 27;
        this.match(PropertyParser.ID);
        this.state = 28;
        this.match(PropertyParser.T__2);
        this.state = 29;
        this.match(PropertyParser.ID);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = PropertyParser.RULE_expr;
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;

ExprContext.prototype.INT = function() {
    return this.getToken(PropertyParser.INT, 0);
};

ExprContext.prototype.EQUALS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.EQUALS);
    } else {
        return this.getToken(PropertyParser.EQUALS, i);
    }
};


ExprContext.prototype.NOT_EQUALS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.NOT_EQUALS);
    } else {
        return this.getToken(PropertyParser.NOT_EQUALS, i);
    }
};


ExprContext.prototype.LESS_THAN = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.LESS_THAN);
    } else {
        return this.getToken(PropertyParser.LESS_THAN, i);
    }
};


ExprContext.prototype.LESS_OR_EQUALS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.LESS_OR_EQUALS);
    } else {
        return this.getToken(PropertyParser.LESS_OR_EQUALS, i);
    }
};


ExprContext.prototype.GREATER_THAN = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.GREATER_THAN);
    } else {
        return this.getToken(PropertyParser.GREATER_THAN, i);
    }
};


ExprContext.prototype.GREATER_OR_EQUALS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(PropertyParser.GREATER_OR_EQUALS);
    } else {
        return this.getToken(PropertyParser.GREATER_OR_EQUALS, i);
    }
};


ExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.enterExpr(this);
	}
};

ExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof PropertyListener ) {
        listener.exitExpr(this);
	}
};

ExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof PropertyVisitor ) {
        return visitor.visitExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};




PropertyParser.ExprContext = ExprContext;

PropertyParser.prototype.expr = function() {

    var localctx = new ExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, PropertyParser.RULE_expr);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 32; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 31;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << PropertyParser.EQUALS) | (1 << PropertyParser.NOT_EQUALS) | (1 << PropertyParser.LESS_THAN) | (1 << PropertyParser.LESS_OR_EQUALS) | (1 << PropertyParser.GREATER_THAN) | (1 << PropertyParser.GREATER_OR_EQUALS))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 34; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << PropertyParser.EQUALS) | (1 << PropertyParser.NOT_EQUALS) | (1 << PropertyParser.LESS_THAN) | (1 << PropertyParser.LESS_OR_EQUALS) | (1 << PropertyParser.GREATER_THAN) | (1 << PropertyParser.GREATER_OR_EQUALS))) !== 0));
        this.state = 36;
        this.match(PropertyParser.INT);
        this.state = 37;
        this.match(PropertyParser.T__3);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.PropertyParser = PropertyParser;
exports.CheckContext = CheckContext;
PropertyParser.CheckContext = CheckContext;
exports.TimeContext = TimeContext;
PropertyParser.TimeContext = TimeContext;
exports.RoleContext = RoleContext;
PropertyParser.RoleContext = RoleContext;
exports.ExprContext = ExprContext;
PropertyParser.ExprContext = ExprContext;
