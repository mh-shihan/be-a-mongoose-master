// db.getCollection("massive-data").createIndex({gender: -1, age: 1})
// Search Index
// db.getCollection("massive-data").createIndex({about: "text"})
db.getCollection("massive-data").find({$text: { $search: "dolor" }})
    .projection({about : 1})