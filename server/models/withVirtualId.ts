import { Schema, Document } from "mongoose";

export default (schema: Schema<Document>) => {
  // Duplicate the ID field.
  schema.virtual('id').get(function(this: Document){
    return this._id.toHexString();
  });

  // Ensure virtual fields are serialised.
  schema.set('toJSON', {
    virtuals: true
  }); 
}