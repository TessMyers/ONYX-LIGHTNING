/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';
var newsAggregator = require('./../../components/news_aggregator/news.aggregator.js');
var _ = require('lodash');
var News = require('./news.model.js');

module.exports = {
  createArticle: createArticle,
  clearOldData: clearOldData,
  index: index,
  show: show,
  destroy: destroy
};

// Fill Database with Yahoo data

newsAggregator.fetchArticles(createArticle);
// clearOldData();

// ############ Functions: ###################

// Create Unique article in DB (uniqueness is determined by the url)
// This function is meant to be a callback for fetchArticles() in parseRSS.js
function createArticle(newArticle) {
  News.create(newArticle, function(err, article){
    if (err) {
      // console.log(err)
      ;
    } else {
      // console.log(newArticle);
      ;
    }
  });
}

// Clear Old Data from the Collection
function clearOldData(){
  var cutoff = new Date();
  //One Day:
  // cutoff.setDate(cutoff.getDate()-1);

  //One Minute:
  cutoff.setTime(cutoff.getTime()-60000);

  News.find({date: {$lt: cutoff}}, function (err, docs) {
    // console.log(docs);
    _.forEach(docs, function(doc){
      console.log(doc.remove());
    });
  });
};


// Get list of things
function index(req, res) {
  News.find(function (err, news) {
    if(err) { return handleError(res, err); }
    return res.json(200, news);
  });
};

// Get a single thing
function show(req, res) {
  News.findById(req.params.id, function (err, news) {
    if(err) { return handleError(res, err); }
    if(!news) { return res.send(404); }
    return res.json(news);
  });
};


// Deletes a thing from the DB.
function destroy(req, res) {
  News.findById(req.params.id, function (err, news) {
    if(err) { return handleError(res, err); }
    if(!news) { return res.send(404); }
    news.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
