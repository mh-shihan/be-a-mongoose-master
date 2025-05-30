// 3. Find all documents where the skill is an empty array.

db.test.find({skills: {$size: 0}}).projection({skills: 1})