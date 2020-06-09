var environment = navigator['environment'] || {};
var database = new ydn.db.Storage(environment.databaseName);
