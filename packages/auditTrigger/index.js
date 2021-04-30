const auditlogger = require('./auditlogger');

exports.handler = async function(event) {    
    auditlogger.processAudit(event);
}