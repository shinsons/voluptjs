// Error handling function(s). 

module.exports = {
    make_schema_error: function(msg) {
        var err = new Error(msg);
        err.isSchemaError = true
        return err
    }
}
