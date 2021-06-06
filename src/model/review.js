import mongoose from 'mongoose';
import Warung from './warung';
let Schema = mongoose.Schema;

let ReviewSchema = new Schema({
  title: String,
  text: String,
  warung: {
    type: Schema.Types.ObjectId, 
    ref: 'Warung'}
},
{ usePushEach: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
