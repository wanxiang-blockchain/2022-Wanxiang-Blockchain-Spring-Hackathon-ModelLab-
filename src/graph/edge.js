export class Edge {

    constructor(src,dst, distribution) {
        this.distribution = new Map();
        this.distribution.set("team", distribution.team);
        this.distribution.set("investor", distribution.investor);
        this.distribution.set("foundation", distribution.foundation);
        this.distribution.set("advisor", distribution.advisor);
        this.distribution.set("community", distribution.community);

        this.src = src;
        this.dst = dst;
    }

}