var util = require('./testUtil');
var Joi = require('joi');
var assert = require('assert');

describe('Populator with schema involved arrays', function () {
  var testConnection = {};
  var testOptions = {};

  before(function (done) {
    util.setUp(testOptions, function (err, connection) {
      if(err) return done(err);
      testConnection = connection;
      done();
    });
  });

  after(function (done) {
    util.tearDown(testConnection, done);
  });

  describe('array of raw types', function() {
    before(function (done) {
      testOptions.size = 50;
      testOptions.schemaPath = 'test/schemas/30_array_field.json';
      testConnection.collection.remove({}, function (err, res) {
        if(err) return done(err);
        util.populator(testOptions, function () {
          done();
        });
      });
    });

    it('should produce correct number of entries', function (done) {
      var trueCount = 50;
      testConnection.collection.count(function (err, count) {
        assert.equal(null, err);
        assert.equal(trueCount, count);
        done();
      });
    });

    it('should produce correct schema structure', function (done) {
      var schema = Joi.object().keys({
        _id: Joi.any().required(),
        name: Joi.string().required(),
        friends: Joi.array().includes(Joi.string()).
                                  excludes(Joi.object()).required()
      }).length(3);
      testConnection.collection.find().each(function (err, item) {
        assert.equal(null, err);
        if(item === null) return done();
        Joi.validate(item, schema, function (err, val) {
          assert.equal(null, err);
        });
      });
    });

    it('should produce docs with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        util.sampleAndStrip(items, 2, function (sample) {
          assert.notDeepEqual(sample[0], sample[1]);
          done();
        });
      });
    });

    it('should produce arrays with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        var validItems = items.filter(function (item) {
          return item.friends.length > 1;
        });
        util.sampleAndStrip(validItems, 1, function (sample) {
          var friends = sample.friends;
          assert.notDeepEqual(friends[0], friends[1]);
          done();
        });
      });
    });
  });

  describe('array of documents', function() {
    before(function (done) {
      testOptions.size = 99;
      testOptions.schemaPath = 'test/schemas/31_array_doc.json';
      testConnection.collection.remove({}, function (err, res) {
        if(err) return done(err);
        util.populator(testOptions, function () {
          done();
        });
      });
    });

    it('should produce correct number of entries', function (done) {
      var trueCount = 99;
      testConnection.collection.count(function (err, count) {
        assert.equal(null, err);
        assert.equal(trueCount, count);
        done();
      });
    });

    it('should produce correct schema structure', function (done) {
      var schema = Joi.object().keys({
        _id: Joi.any().required(),
        name: Joi.string().required(),
        friends: Joi.array().includes(Joi.object().keys({
          name: Joi.string().required(),
          phone: Joi.string().regex(util.regex.phone).required()
        }).length(2)).required()
      }).length(3);
      testConnection.collection.find().each(function (err, item) {
        assert.equal(null, err);
        if(item === null) return done();
        Joi.validate(item, schema, function (err, val) {
          assert.equal(null, err);
        });
      });
    });

    it('should produce docs with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        util.sampleAndStrip(items, 2, function (sample) {
          assert.notDeepEqual(sample[0], sample[1]);
          done();
        });
      });
    });

    it('should produce arrays with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        var validItems = items.filter(function (item) {
          return item.friends.length > 1;
        });
        util.sampleAndStrip(validItems, 1, function (sample) {
          var friends = sample.friends;
          assert.notDeepEqual(friends[0], friends[1]);
          done();
        });
      });
    });
  });

  describe('array of embedded docs', function() {
    before(function (done) {
      testOptions.size = 13;
      testOptions.schemaPath = 'test/schemas/32_array_embed.json';
      testConnection.collection.remove({}, function (err, res) {
        if(err) return done(err);
        util.populator(testOptions, function () {
          done();
        });
      });
    });

    it('should produce correct number of entries', function (done) {
      var trueCount = 13;
      testConnection.collection.count(function (err, count) {
        assert.equal(null, err);
        assert.equal(trueCount, count);
        done();
      });
    });

    it('should produce correct schema structure', function (done) {
      var schema = Joi.object().keys({
        _id: Joi.any().required(),
        name: Joi.string().required(),
        friends: Joi.array().includes(Joi.object().keys({
          name: Joi.string().required(),
          payment_method: Joi.object().keys({
            type: Joi.string().required(),
            card: Joi.number().integer().required(),
            expiration: Joi.string().regex(util.regex.exp).required()
          }).length(3).required()
        }).length(2)).required()
      }).length(3);
      testConnection.collection.find().each(function (err, item) {
        assert.equal(null, err);
        if(item === null) return done();
        Joi.validate(item, schema, function (err, val) {
          assert.equal(null, err);
        });
      });
    });

    it('should produce docs with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        util.sampleAndStrip(items, 2, function (sample) {
          assert.notDeepEqual(sample[0], sample[1]);
          done();
        });
      });
    });

    it('should produce arrays with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        var validItems = items.filter(function (item) {
          return item.friends.length > 1;
        });
        util.sampleAndStrip(validItems, 1, function (sample) {
          var friends = sample.friends;
          assert.notDeepEqual(friends[0], friends[1]);
          done();
        });
      });
    });
  });

  describe('array of arrays', function() {
    before(function (done) {
      testOptions.size = 9;
      testOptions.schemaPath = 'test/schemas/33_array_arrays.json';
      testConnection.collection.remove({}, function (err, res) {
        if(err) return done(err);
        util.populator(testOptions, function () {
          done();
        });
      });
    });

    it('should produce correct number of entries', function (done) {
      var trueCount = 9;
      testConnection.collection.count(function (err, count) {
        assert.equal(null, err);
        assert.equal(trueCount, count);
        done();
      });
    });

    it('should produce correct schema structure', function (done) {
      var schema = Joi.object().keys({
        _id: Joi.any().required(),
        name: Joi.string().required(),
        friends: Joi.array().includes(Joi.object().keys({
          name: Joi.string().required(),
          payment_method: Joi.array().includes(Joi.object().keys({
            type: Joi.string().required(),
            card: Joi.number().integer().required(),
            expiration: Joi.string().regex(util.regex.exp).required()
          }).length(3)).required()
        }).length(2)).required()
      }).length(3);
      testConnection.collection.find().each(function (err, item) {
        assert.equal(null, err);
        if(item === null) return done();
        Joi.validate(item, schema, function (err, val) {
          assert.equal(null, err);
        });
      });
    });

    it('should produce docs with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        util.sampleAndStrip(items, 2, function (sample) {
          assert.notDeepEqual(sample[0], sample[1]);
          done();
        });
      });
    });

    it('should produce arrays with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        var validItems = items.filter(function (item) {
          return item.friends.length > 1;
        });
        util.sampleAndStrip(validItems, 1, function (sample) {
          var friends = sample.friends;
          assert.notDeepEqual(friends[0], friends[1]);
          done();
        });
      });
    });

    it('should produce embedded arrays with random content', function (done) {
      testConnection.collection.find().toArray(function (err, items) {
        assert.equal(null, err);
        var validItems = items.filter(function (item) {
          return item.friends.filter(function (item) {
            return item.payment_method.length > 1;
          }).length > 0;
        });
        util.sampleAndStrip(validItems, 1, function (sample) {
          var validSubItems = sample.friends.filter(function (item) {
            return item.payment_method.length > 1;
          });
          util.sampleAndStrip(validSubItems, 1, function (sample) {
            var payments = sample.payment_method;
            assert.notDeepEqual(payments[0], payments[1]);
            done();
          });
        });
      });
    });
  });

});