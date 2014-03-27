tint.js
=======

A Tinted Logger for any JS project. 

## Usage ##

> var log = new TintedLogger({'showTime': false});

> log.allowAll();

> var $log = log.debug;

> log.info('Some good info', window);
> log.error('Just an error');
> log.success('Yehee success');
> log.warn('hmm, this is wrong', this);
> $log('just debugging!');


> log.register('service', {
>>    fontColor      : 'white',
>>    backgroundColor: 'red',
>>    defaultVal     : 'running'
> });