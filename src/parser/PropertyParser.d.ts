import {CommonTokenStream, Parser, ParserRuleContext, Token} from 'antlr4';
import {TerminalNode} from 'antlr4/tree/Tree';


export declare class CheckContext extends ParserRuleContext {
    
}

export declare class TimeContext extends ParserRuleContext {
    
    INT(): TerminalNode;
    
}

export declare class RoleContext extends ParserRuleContext {
    
}

export declare class ExprContext extends ParserRuleContext {
    
    INT(): TerminalNode;
    
}


export declare class PropertyParser extends Parser {
    readonly ruleNames: string[];
    readonly literalNames: string[];
    readonly symbolicNames: string[];

    constructor(input: CommonTokenStream);
    
    check(): CheckContext;

    time(): TimeContext;

    role(): RoleContext;

    expr(): ExprContext;

}
