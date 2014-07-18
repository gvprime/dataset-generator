var helper = require('./helper');
var assert = require('assert');

describe('scoping', function() {
  var res = { item: null };
  before(function(done) {
    var opts = {
      size: 1,
      schema: {
        'greetings': 'This is {{this.name}}',
        'name': '{{chance.name()}}',
        'zip': '00000',
        'full_zip': '{{this.zip+"-0000"}}',
        'num': {
          'one': 1
        },
        'two': '{{Double(this.num.one+1)}}',
        'dependent': '{{this.s1}}-{{this.s2}}',
        's1': 'Constant',
        's2': '{{chance.name()}}'
      }
    };
    helper.getResults(opts, function (err, items) {
      if (err) return done(err);
      res.item = items[0];
      done();
    });
  });

  it('should work with constants', function () {
    assert.equal('00000', res.item.zip);
    assert.equal('00000-0000', res.item.full_zip);
  });

  it('should work with random content', function () {
    var name = res.item.name;
    assert.equal('This is ' + name, res.item.greetings);
  });

  it('should work with embedded docs', function () {
    assert.ok(typeof res.item.num.one === 'number');
    assert.deepEqual(1, res.item.num.one);
    assert.ok(typeof res.item.two === 'number');
    assert.deepEqual(2, res.item.two);
  });

  it('should support using not-yet-generated variables', function () {
    var d = res.item.dependent;
    assert.ok(typeof d === 'string');
    var comps = d.split('-');
    assert.equal('Constant', comps[0]);
    assert.equal(res.item.s2, comps[1]);
  });

});
