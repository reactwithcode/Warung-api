import mongoose from 'mongoose';
import { Router } from 'express';
import Warung from '../model/warung';
import Review from '../model/review';
import bodyParser from 'body-parser';
import passport from 'passport';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/warung' - GET all food trucks
  api.get('/', authenticate, (req, res) => {
    Warung.find({}, (err, warungs) => {
      if (err) {
        res.send(err);
      }
      res.json(warungs);
    });
  });

  // '/v1/warung/:id' - GET a specific food truck
  api.get('/:id', (req, res) => {
    Warung.findById(req.params.id, (err, warung) => {
      if (err) {
        res.send(err);
      }
      res.json(warung);
    });
  });

  // '/v1/warung/add' - POST - add a food truck
  api.post('/add', authenticate, (req, res) => {
    let newWarung = new Warung();
    newWarung.name = req.body.name;
    newWarung.foodtype = req.body.foodtype;
    newWarung.avgcost = req.body.avgcost;
    newWarung.geometry.coordinates = req.body.geometry.coordinates;

    newWarung.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Warung saved successfully' });
    });
  });

  // '/v1/warung/:id' - DELETE - remove a food truck
  api.delete('/:id', (req, res) => {
    Warung.remove({
      _id: req.params.id
    }, (err, warung) => {
      if (err) {
        res.send(err);
      }
      Review.remove({
        warung: req.params.id
      }, (err, review) => {
        if (err) {
          res.send(err);
        }
        res.json({message: "Warung and Reviews Successfully Removed"});
      });
    });
  });

  // '/v1/warung/:id' - PUT - update an existing record
  api.put('/:id', (req, res) => {
    Warung.findById(req.params.id, (err, warung) => {
      if (err) {
        res.send(err);
      }
      warung.name = req.body.name;
      warung.foodtype = req.body.foodtype;
      warung.avgcost = req.body.avgcost;
      warung.geometry.coordinates = req.body.geometry.coordinates;
      warung.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Warung info updated' });
      });
    });
  });

  // add a review by a specific warung id
  // '/v1/warung/reviews/add/:id'
  api.post('/reviews/add/:id', (req, res) => {
    Warung.findById(req.params.id, (err, warung) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.warung = warung._id;
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        warung.reviews.push(newReview);
        warung.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Warung review saved' });
        });
      });
    });
  });

  // get reviews for a specific warung id
  // '/v1/warung/reviews/:id'
  api.get('/reviews/:id', (req, res) => {
    Review.find({warung: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api;
}
