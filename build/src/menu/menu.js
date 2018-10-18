"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
const type_safe_json_decoder_1 = require("type-safe-json-decoder");
const tokenizer_1 = require("../tokenizer");
const utilities_1 = require("../utilities");
// tslint:disable-next-line:no-any
function MenuItemFromYamlItem(item) {
    return {
        pid: utilities_1.copyScalar(item, 'pid', 'number'),
        name: utilities_1.copyScalar(item, 'name', 'string'),
        registerName: utilities_1.copyScalar(item, 'registerName', 'string'),
        aliases: utilities_1.copyArray(item, 'aliases', 'string'),
        price: utilities_1.copyScalar(item, 'price', 'number'),
        standalone: utilities_1.copyScalar(item, 'standalone', 'boolean'),
        defaults: utilities_1.copyArray(item, 'defaults', 'number'),
        options: utilities_1.copyArray(item, 'options', 'number'),
    };
}
class Menu extends tokenizer_1.Index {
    constructor(items) {
        super();
        this.items = {};
        this.addItem = (item) => {
            if (item.pid in this.items) {
                console.log(`Menu: skipping duplicate ${item.pid}`);
            }
            else {
                this.items[item.pid] = item;
            }
        };
        items.forEach(this.addItem);
    }
    // TODO: return IMenu?
    static fromJsonFilename(filename) {
        const json = fs.readFileSync(filename, 'utf8');
        const menuItemsDecoder = type_safe_json_decoder_1.array(type_safe_json_decoder_1.object(['pid', type_safe_json_decoder_1.number()], ['name', type_safe_json_decoder_1.string()], ['register_name', type_safe_json_decoder_1.string()], ['aliases', type_safe_json_decoder_1.array(type_safe_json_decoder_1.string())], ['defaults', type_safe_json_decoder_1.array(type_safe_json_decoder_1.number())], ['options', type_safe_json_decoder_1.array(type_safe_json_decoder_1.number())], ['price', type_safe_json_decoder_1.number()], ['standalone', type_safe_json_decoder_1.boolean()], (pid, name, registerName, aliases, defaults, options, price, standalone) => ({
            pid,
            name,
            registerName,
            aliases,
            defaults,
            options,
            price,
            standalone
        })));
        const items = menuItemsDecoder.decodeJSON(json);
        return new Menu(items);
    }
    static fromYamlFilename(filename) {
        // tslint:disable-next-line:no-any
        const yamlMenu = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        if (typeof (yamlMenu) !== 'object') {
            throw TypeError('Menu: expected a top-level object with items array.');
        }
        const yamlItems = yamlMenu['items'];
        if (yamlItems === undefined || !Array.isArray(yamlMenu.items)) {
            throw TypeError('Menu: expected items array.');
        }
        const items = yamlItems.map(MenuItemFromYamlItem);
        return new Menu(items);
    }
    length() {
        return Object.keys(this.items).length;
    }
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map