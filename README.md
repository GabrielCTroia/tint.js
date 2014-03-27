tint.js
=======

A Tinted Logger for any JS project. 

Usage
=====

// Instantiate the logger
var log = new TintedLogger({'showTime': false});
// Set the Msg Levels
log.allowAll();
//log.disallowAll(['jpState']);
var $log = log.debug;

log.register('service', {
    fontColor      : 'white',
    backgroundColor: 'red',
    defaultVal     : 'running'
});

log.info('Some good info', window);
log.error('Just an error');
log.success('Yehee success');
log.warn('hmm, this is wrong', this);
$log('just debugging!');