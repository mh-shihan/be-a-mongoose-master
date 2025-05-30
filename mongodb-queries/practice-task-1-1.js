// 1. Find all documents in the collection where the age is greater than 30, and only return the name and email fields.

db.test.find({ age: { $gt: 30 } })
    .projection({ name: 1, email: 1, age: 1 })
    .sort({ age: 1 })
    .limit(0)