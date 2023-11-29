"use strict";
exports.__esModule = true;
exports.db = void 0;
var loadDatabase_1 = require("./loaders/loadDatabase");
var agendaFeatures = require("./features/agendaFeatures");
exports.db = { knex: loadDatabase_1["default"], functions: agendaFeatures };
//# sourceMappingURL=loadCoreModule.js.map