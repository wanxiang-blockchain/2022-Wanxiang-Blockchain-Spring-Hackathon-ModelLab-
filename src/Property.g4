grammar Property;
check  : time+  role+ expr+;     
time   : 'After' INT 'days';
role   : ID '.' ID;
expr   : (EQUALS | NOT_EQUALS | LESS_THAN | LESS_OR_EQUALS | GREATER_THAN | GREATER_OR_EQUALS)+ INT '%';

INT : [0-9]+ ;                  // match number
ID  : [A-Za-z]+ ;                  // match alphabet

EQUALS                  : 'eq' | '==';
NOT_EQUALS              : 'ne' | '!=';
LESS_THAN               : 'lt' | '<';
LESS_OR_EQUALS          : 'le' | '<=';
GREATER_THAN            : 'gt' | '>';
GREATER_OR_EQUALS       : 'ge' | '>=';

WS : [ \t\r\n]+ -> skip ;       // match white space