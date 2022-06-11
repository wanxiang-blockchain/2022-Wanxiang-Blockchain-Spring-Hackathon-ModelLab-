import {CommonTokenStream, ParserRuleContext, Token} from 'antlr4';
import {ErrorNode, ParseTreeListener, TerminalNode} from 'antlr4/tree/Tree';

import {CheckContext} from './PropertyParser';

import {TimeContext} from './PropertyParser';

import {RoleContext} from './PropertyParser';

import {ExprContext} from './PropertyParser';


export declare class PropertyListener implements ParseTreeListener {
    constructor();
    
    enterCheck(ctx: CheckContext): void;
    
    exitCheck(ctx: CheckContext): void;
    
    enterTime(ctx: TimeContext): void;
    
    exitTime(ctx: TimeContext): void;
    
    enterRole(ctx: RoleContext): void;
    
    exitRole(ctx: RoleContext): void;
    
    enterExpr(ctx: ExprContext): void;
    
    exitExpr(ctx: ExprContext): void;
    
    visitTerminal(node: TerminalNode): void;

    visitErrorNode(node: ErrorNode): void;

    enterEveryRule(node: ParserRuleContext): void;

    exitEveryRule(node: ParserRuleContext): void;
}
