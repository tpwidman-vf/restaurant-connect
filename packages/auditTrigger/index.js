const auditlogger = require('./auditlogger');

exports.handler = async function(event) {    
    auditlogger.logAudit(event);
}