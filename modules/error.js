/**
 * Error handling function(s). 
 */

module.exports = {
  makeSchemaError: function(msg) {
    /** Adds a property indicating that this error is a schema error. 
     * @param {string} msg standard error constructor message
     */
    var err = new Error(msg);
    err.isSchemaError = true
    return err
  }
}
