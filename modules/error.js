/**
 * Error handling function(s).
 */

export default (msg) => {
  /** Adds a property indicating that this error is a schema error.
   * @param {string} msg standard error constructor message
   */
  const err = new Error(msg);
  err.isSchemaError = true;
  return err;
};
