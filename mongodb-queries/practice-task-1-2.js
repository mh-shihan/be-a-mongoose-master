// Find documents where the favorite color is either "Maroon" or "Blue."

db.test.find({favoutiteColor: {$in: ["Maroon", "Blue"]}}, {favoutiteColor: 1})