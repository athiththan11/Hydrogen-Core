'use strict';

const __path = require('path');
const fs = require('fs');

const constants = require('./constants');

/**
 * method to read and return postgre sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} workingDir path of the working directory
 * @returns combined SQL script
 */
async function readPostgreSQLScripts(platform, workingDir = process.cwd()) {
    let scripts = [];

    if (platform === 'is') {
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.dbscripts, constants.dbscripts.postgre)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.identity, constants.dbscripts.postgre)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.storedProcedure, 'postgre', constants.dbscripts.postgre)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.uma, constants.dbscripts.postgre)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.consent, constants.dbscripts.postgre)).toString());
    }

    if (platform === 'apim') {
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.apim.apimgt, constants.dbscripts.postgre)).toString());
    }

    return scripts.join('\n');
}

/**
 * method to read and return mysql sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} workingDir path of the working directory
 * @returns combined SQL script
 */
async function readMySQLScripts(platform, workingDir = process.cwd()) {
    let scripts = [];

    if (platform === 'is') {
        scripts.push("SET SQL_MODE='ALLOW_INVALID_DATES';");
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.dbscripts, constants.dbscripts.mysql)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.identity, constants.dbscripts.mysql)).toString());
        // scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.storedProcedure, 'mysql', constants.dbscripts.mysql)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.uma, constants.dbscripts.mysql)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.consent, constants.dbscripts.mysql)).toString());
    }

    if (platform === 'apim') {
        scripts.push("SET SQL_MODE='ALLOW_INVALID_DATES';");
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.apim.apimgt, constants.dbscripts.mysql)).toString());
    }

    return scripts.join('');
}

/**
 * method to read and return mssql sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} workingDir path of the working directory
 * @returns combined SQL script
 */
async function readMSSQLScripts(platform, workingDir = process.cwd()) {
    let scripts = [];

    if (platform === 'is') {
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.dbscripts, constants.dbscripts.mssql)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.identity, constants.dbscripts.mssql)).toString());
        // scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.storedProcedure, 'mssql', constants.dbscripts.mssql)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.uma, constants.dbscripts.mssql)).toString());
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.is.consent, constants.dbscripts.mssql)).toString());
    }

    if (platform === 'apim') {
        scripts.push(fs.readFileSync(__path.join(workingDir, constants.sql.apim.apimgt, constants.dbscripts.mssql)).toString());
    }

    return scripts.join('');
}

exports.readPostgreSQLScripts = readPostgreSQLScripts;
exports.readMySQLScripts = readMySQLScripts;
exports.readMSSQLScripts = readMSSQLScripts;
