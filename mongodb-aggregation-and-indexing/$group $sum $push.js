db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: "$address.country",
            totalDocs: {$sum: 1},
            fullDocs: {$push: "$$ROOT"}
        }
    },
    {
        $project: {
            "fullDocs.age" : 1,
            "fullDocs.name" : 1
        }
    
    }
])
