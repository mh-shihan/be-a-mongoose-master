db.test.aggregate([
    // Stage-1
    {$match: {gender: "Male", age: {$gt: 30}}},
    // Stage-2
    {$project: {gender: 1, MaleAge:"$age" }},
    ]).sort({age: 1}).pretty()