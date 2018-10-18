import { Index, Item, PID } from '../tokenizer';
export interface MenuItem extends Item {
    pid: PID;
    name: string;
    registerName: string;
    aliases: string[];
    defaults: PID[];
    options: PID[];
    price: number;
    standalone: boolean;
}
export declare class Menu extends Index<MenuItem> {
    items: {
        [index: number]: MenuItem;
    };
    static fromJsonFilename(filename: string): Menu;
    static fromYamlFilename(filename: string): Menu;
    constructor(items: MenuItem[]);
    addItem: (item: MenuItem) => void;
    length(): number;
}
