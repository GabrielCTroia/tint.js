/**
 * author Gabriel Troia
 * link https://github.com/gabrielcatalin
 *
 * inspired by Paul Irish | http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
function TintedLogger(config) {

    var turnedOff = false,
        config = config || {},
        self = this;

    this.history = this.history || [];   // store logs to an array for reference
    this.history.push(arguments);


    this.allowingAll = false;

    this.allowonces = {
        debug     : 0,
        info      : 0,
        warn      : 0,
        error     : 0,
        success   : 0,
        inbound   : 0,
        outbound  : 0,
        service   : 0,
        controller: 0
    }
    /**
     * Run the console.log
     *
     * @param msg
     * @param val
     * @param fontColor
     * @param bkgColor
     */
    function print(msg, val, fontColor, bkgColor) {
        if (!window.console || turnedOff) return;

        var str = "%c";
        str += (config.showTime) ? getTime() : '';
        str += ' ' + msg;

        if (typeof bkgColor == 'undefined') {
            console.log(str, 'color:' + fontColor + ';', val);
        } else {
            console.log(str+' ', 'color:' + fontColor + ';background-color:' + bkgColor + ';', val);
        }
    }

    /**
     * Shuts it down completely
     */
    this.turnOff = function() {
        turnedOff = true;
    }

    /**
     * Allows all the log methods except for the ones in the except array
     *
     * @param except Array
     */
    this.allowAll = function(except) {
        for (var i in self.allowonces) {
            self.allowonces[i] = true;
        }

        // If there are exceptions disallow them
        self.disallow(except);
    }

    /**
     * Allows the given log method
     *
     * @param options Object
     */
    this.allow = function(options) {
        if (typeof options == 'string') {
            self.allowonces[options] = true;
            return;
        }

        for (var i in options) {
            var option = options[i];

            self.allowonces[option] = true;
        }
    }

    /**
     * Disallows all the log method except for the ones in the except array
     *
     * @param except
     */
    this.disallowAll = function(except) {
        for (var i in self.allowonces) {
            // skip the excepted once
            if (except && indexOf.call(except, self.allowonces[i]) > 0) continue;

            self.allowonces[i] = false;
        }

        // If there are exceptions allow them
        self.allow(except);
    }

    /**
     * Dissalows the given log method
     *
     * @param options
     */
    this.disallow = function(options) {
        if (typeof options == 'string') {
            self.allowonces[options] = false;
            return;
        }

        for (var i in options) {
            var option = options[i];

            self.allowonces[option] = false;
        }
    }

    /**
     * Inspired from UNIXs chmod command
     *
     * @param config
     */
    this.chMod = function(config) {
        if (typeof config == 'string' && config == 'allowAll') {
            self.allowAll();
            return;
        } else if (!config) {
            self.turnOff();
            return;
        }

        self.allowonces.debug = config.debug || 0;
        self.allowonces.info = config.info || 0;
        self.allowonces.warn = config.warn || 0;
        self.allowonces.error = config.error || 0;
        self.allowonces.success = config.success || 0;
    }

    /**
     * Registers a new custom log method to be called
     *
     * @param customMethodName
     * @param options
     * @param filters
     */
    this.register = function(customMethodName, options, filters) {

        // If the customName was already registered
        // Don't let it overwrite the previous registration
        if (typeof self[customMethodName] != 'undefined') return;

        var defaultOptions = {
            fontColor      : '333',
            backgroundColor: null,
            defaultMsg     : customMethodName + ' | Debug',
            defaultVal     : ''
        }
        extend(defaultOptions, options || {});

        filters = filters || {};

        self[customMethodName] = function(msg, val) {
            if (!self.allowonces[customMethodName]) return;

            msg = msg || options.defaultMsg;
            val = val || options.defaultVal;

            msg = (filters.msgFilter) ? filters.msgFilter(msg) : msg;
            val = (filters.valFilter) ? filters.valFilter(val) : val;

            print(msg + ' ', val, options.fontColor, options.backgroundColor);
        }

        // Allow it to log
        self.allowonces[customMethodName] = true;
    }

    /**
     * Helper method
     * Extends a data structure
     *
     * Works with the 1st level only
     *
     * @param base
     * @param extendee
     */
    function extend(base, extendee) {
        for (var i in base) {
            if (!extendee.hasOwnProperty(i)) {
                extendee[i] = base[i];
            }
        }
    }


    // Some default log method

    this.info = function(msg, val) {
        if (self.allowonces.info && !self.allowingAll)
            print(msg, val || '', '#008DC4', null); // blue
    }
    this.warn = function(msg, val) {
        if (self.allowonces.warn && !self.allowingAll)
            print(msg, val || '', 'white', '#E68739'); // orange
    }
    this.error = function(msg, val) {
        if (self.allowonces.error && !self.allowingAll)
            print(msg, val || '', '#fff', 'red'); // font:white; background: red
    }
    this.success = function(msg, val) {
        if (self.allowonces.success && !self.allowingAll)
            print(msg, val || '', '#009E0B', null); // green
    }

    /**
     * The debug method works a little different than the others
     * It doesn't show a msg but only a val.
     * That's b/c most of the time we don't care about the msg but the value, when debugging.
     *
     * You cans still have a msg but it's on the 2nd position
     *
     * @param val
     * @param msg
     */
    this.debug = function(val, msg) {
        if (!self.allowonces.debug && !self.allowingAll) return;
        msg = (typeof msg != 'undefined') ? msg + ' ' : 'Debug ';
        print(msg, val, '#fff', '#F222E4;'); // font: white; background: pink
    }
};