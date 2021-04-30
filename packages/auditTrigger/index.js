const auditlogger = require('./auditlogger');

exports.handler = async function(event) {    
    await auditlogger.processAudit(event);
}